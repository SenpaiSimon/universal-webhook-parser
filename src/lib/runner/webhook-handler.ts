import { executeSnippetWithPayload } from './executor';
import os from 'os';
import type { ParsedResult, WebhookPayload } from './types';

export async function handleWebhook(
  userSnippet: string,
  webhookData: any
): Promise<ParsedResult> {
  const webhookPayload = {
    timestamp: new Date().toISOString(),
    data: webhookData
  } as WebhookPayload;

  const tempDir = os.tmpdir();
  const output = executeSnippetWithPayload(userSnippet, webhookPayload, tempDir) as string;

  // json result will be the very last thing
  const lines: string[] = output.trim().split('\n');
  const lastLine: string | undefined = lines.pop();
  
  return JSON.parse(lastLine || '{}') as ParsedResult;
}
