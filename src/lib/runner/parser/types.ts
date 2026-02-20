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

export function genParserInterfaceString(): string {
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

export function genParserVarInit(payload: WebhookPayload): string {
  const block = `
const payload: WebhookPayload = ${JSON.stringify(payload)};
const result: ParsedResult = {
  success: true,
	title: '',
}
`
  return block;
} 