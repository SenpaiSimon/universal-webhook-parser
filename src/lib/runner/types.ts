export interface WebhookPayload {
  timestamp: string;
  data: any;
}

export interface ParsedResult {
  success: boolean;
  title: string;
  message?: string;
  payload?: any;
}

export function genInterfaceString(): string {
  const block = `
interface WebhookPayload {
  timestamp: string;
  data: any;
}

interface ParsedResult {
  success: boolean;
  title: string;
  message?: string;
  payload?: any;
}
`
  return block;
}

export function genVarsInit(payload: WebhookPayload): string {
  const block = `
const payload: WebhookPayload = ${JSON.stringify(payload)};
const result: ParsedResult = {
  success: true,
	title: '',
}
`
  return block;
} 