
export interface WebhookPayload {
  timestamp: string;
  data: any;
}

export type ResultAction = "continue" | "skip" | "error";

export interface ParsedResult {
  action: ResultAction;
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

type ResultAction = "continue" | "skip" | "error";

interface ParsedResult {
  action: ResultAction;
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
  action: "continue",
	title: '',
}
`
  return block;
} 