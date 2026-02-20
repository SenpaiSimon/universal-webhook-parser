import type { ParsedResult } from "$lib/runner/parser/types";
import type { WebhookTargetSettings } from "./types";

export async function HandleWebhookTarget(payload: ParsedResult, settings: any) {
  const { url, method } = settings as WebhookTargetSettings;

  let res: Response = {} as Response;

  switch(method) {
    case "POST":
      res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
    case "GET":
      // parse to query params
      const queryParams = new URLSearchParams(payload as any).toString();
      res = await fetch(`${url}?${queryParams}`, {
        method
      });
      break;
    default:
      throw new Error(`Unsupported method: ${method}`);
  }


  if(!res.ok) {
    throw new Error(`Failed to send webhook: ${res.statusText}`);
  }
}