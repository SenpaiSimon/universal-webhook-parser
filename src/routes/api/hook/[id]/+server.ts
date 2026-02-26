import { json } from '@sveltejs/kit';
import type { RouteParams } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { eq } from 'drizzle-orm';
import { hooks, task } from '$lib/server/db/schema.js';
import { base64Decode } from '$lib/helpers/encoders.js';
import { handleWebhook } from '$lib/runner/parser/webhook-handler.js';
import { TargetMapping, type TargetType } from '$lib/targets/types.js';

export type IncHookStatus = 'success' | 'invalid' | 'execution_error' | 'result_error' | 'pending' | 'webhook_error' | 'config_error' | 'skipped';

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

async function setTaskState(taskId: string, status: IncHookStatus, parsedResult?: any) {
    await db.update(task).set({
        status,
        endTime: new Date().toISOString(),
        parsed_result: parsedResult ? JSON.stringify(parsedResult) : "{}"
    }).where(eq(task.id, taskId));
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

    // get the corresponding parser and also the target
    const parserEntry = await db.query.parser.findFirst({
        where: eq(hooks.id, hook.parserId)
    });

    const targetEntry = await db.query.target.findFirst({
        where: eq(hooks.id, hook.targetId)
    });

    if(!parserEntry) {
        return json(genResponse('invalid', id, method), { status: 400 });
    }

    if(!targetEntry) {
        return json(genResponse('invalid', id, method), { status: 400 });
    }

    // task is pending
    const [taskEntry] = await db.insert(task).values({
        hookId: id,
        status: 'pending',
        webhook_payload: JSON.stringify(payload),
        startTime: new Date().toISOString(),
    }).returning();
    

    const code = base64Decode(parserEntry.code);

    // execute the parser code with the incoming webhook data
    try {
        const res = await handleWebhook(code, payload);

        // did it work?
        if(res.action == "error") {
            await setTaskState(taskEntry.id, 'result_error', { msg: "result.action was 'error'"});

            return json(genResponse('result_error', id, method), { status: 500 });
        }

        // did we want to skip sending this?
        if(res.action == "skip") {
            await setTaskState(taskEntry.id, 'skipped', res);
            return json(genResponse('skipped', id, method));
        }
        
        // send the result to the out hooks callback url with required method
        const targetType = targetEntry.targetImpl as TargetType;
        const targetSettings = JSON.parse(targetEntry.settings);

        if(targetSettings === null || Object.keys(targetSettings).length === 0) {
            await setTaskState(taskEntry.id, 'config_error', { msg: "Target Settings were empty" });
            console.error("No target settings found for:", targetEntry.id);
            return json(genResponse('config_error', id, method), { status: 500 });
        }

        const target = TargetMapping[targetType];

        if(!target) {
            await setTaskState(taskEntry.id, 'execution_error', { msg: "No target implementation found for type: " + targetType });
            console.error("No target implementation found for:", targetType);
            return json(genResponse('execution_error', id, method), { status: 500 });
        }

        await target.handler(res, targetSettings);
    
        // mark task as success
        await setTaskState(taskEntry.id, 'success', res);
        return json(genResponse('success', id, method));
    } catch(error) {
        await setTaskState(taskEntry.id, 'execution_error', { msg: error instanceof Error ? error.message : "Unknown error" });
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