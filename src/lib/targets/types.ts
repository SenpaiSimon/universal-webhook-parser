import type { ParsedResult } from "$lib/runner/parser/types";
import { HandleEmailTarget } from "./email";
import { HandleWebhookTarget } from "./webhook";

// what do we support?
export const ALL_TARGET_TYPES = ["webhook", "email"] as const;

// derive type
export type TargetType = typeof ALL_TARGET_TYPES[number];

// settings types
export type WebhookTargetSettings = {
  url: string;
  method: "POST" | "GET";
}

export type EmailTargetSettings = {
  recipients: string;
  subjectTemplate: string;
  bodyTemplate: string;
}

// add settings datatype for each one
export type TargetMappingEntry = {
  type: TargetType;
  handler: (payload: ParsedResult, settings: any) => Promise<void>;
}

// create the mapping
export const TargetMapping: Record<TargetType, TargetMappingEntry> = {
  webhook: {
    type: "webhook",
    handler: HandleWebhookTarget
  },
  email: {
    type: "email",
    handler: HandleEmailTarget
  }
}