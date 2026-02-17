import { json } from '@sveltejs/kit';
import type { RouteParams } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { eq } from 'drizzle-orm';
import { hooks, parser } from '$lib/server/db/schema.js';
import { base64Decode } from '$lib/helpers/encoders.js';
import { handleWebhook } from '$lib/runner/webhook-handler.js';

export type IncHookStatus = 'success' | 'invalid' | 'execution_error' | 'result_error';

export type IncHookMethod = 'GET' | 'POST';

export type IncHookResponse = {
    status: IncHookStatus;
    method: IncHookMethod;
    id: string;
}

function genResponse(status: IncHookStatus, id: string, method: IncHookMethod): IncHookResponse {    
    return {
        status,
        method,
        id,
    }
}

async function HandleRequest(params: RouteParams, method: IncHookMethod, payload: any) {
    const id = params.id;

    // valid hook?
    const hook = await db.query.hooks.findFirst({
        where: eq(hooks.id, id)
    })

    if(!hook) {
        return json(genResponse('invalid', id, method), { status: 400 });
    }

    // get the corresponding parser
    const parserEntry = await db.query.parser.findFirst({
        where: eq(hooks.id, hook.parserId)
    });

    if(!parserEntry) {
        return json(genResponse('invalid', id, method), { status: 400 });
    }

    // TODO add a task entry and mark as pending

    const code = base64Decode(parserEntry.code);

    // execute the parser code with the incoming webhook data
    try {
        const res = await handleWebhook(code, payload);

        // was it result?
        if(!res.success) {
            // todo mark task as failed
            return json(genResponse('result_error', id, method), { status: 500 });
        }
        
        // send the result to the out hooks callback url with required method
        // console.log(`Parsed result for hook ${id}:`, res);
    
        // mark task as success
        return json(genResponse('success', id, method));
    } catch(error) {
        // todo mark task as failed
        console.error("Error executing webhook handler:", error);
        return json(genResponse('execution_error', id, method), { status: 500 });
    }
}

export async function POST({ params, request }) {
    const payload = await request.json();
    return HandleRequest(params, 'POST', payload);
}

export async function GET({ params, url }) {
    const payload = Object.fromEntries(url.searchParams);
    return HandleRequest(params, 'GET', payload);
}