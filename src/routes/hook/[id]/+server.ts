import { json } from '@sveltejs/kit';
import type { RouteParams } from './$types.js';
import { db } from '$lib/server/db/index.js';

export type IncHookStatus = 'success' | 'invalid';

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

async function HandleRequest(params: RouteParams, method: IncHookMethod) {
    const id = params.id;

    // valid hook?
    const hook = await db.query.hooks.findFirst({
        where: (hooks, { eq }) => eq(hooks.id, id)
    })

    if(!hook) {
        return json(genResponse('invalid', id, method), { status: 400 });
    }

    // now the task part

    return json(genResponse('success', id, method));
}

export async function POST({ params }) {
    return HandleRequest(params, 'POST');
}

export async function GET({ params }) {
    return HandleRequest(params, 'GET');
}