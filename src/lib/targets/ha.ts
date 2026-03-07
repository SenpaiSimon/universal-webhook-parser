import { resolveTemplate } from "$lib/helpers/templateResolver";
import type { ParsedResult } from "$lib/runner/parser/types";
import { db } from "$lib/server/db";
import type { HaTargetSettings } from "./types";

export async function HandleHaTarget(payload: ParsedResult, settings: any) {
  const { recipient, titleTemplate, bodyTemplate, imageUrl, group } = settings as HaTargetSettings;

  const haSettings = await db.query.settingsHa.findFirst();

  if(!haSettings || haSettings.token.length === 0 || haSettings.url.length === 0) {
    throw new Error("Home Assistant settings not configured");
  }

  const resolvedTitle = resolveTemplate(titleTemplate, payload as any);
  const resolvedBody = resolveTemplate(bodyTemplate, payload as any);
  const resolvedImageUrl = resolveTemplate(imageUrl, payload as any);
  const resolvedGroup = resolveTemplate(group, payload as any);

  const body: any = {
    message: resolvedBody,
    title: resolvedTitle
  };

  const data: any = {};
  if (resolvedImageUrl.length > 0) {
    data.icon_url = resolvedImageUrl;
  }
  if (resolvedGroup.length > 0) {
    data.group = resolvedGroup;
  }

  if (Object.keys(data).length > 0) {
    body.data = data;
  }

  const res = await fetch(`${haSettings.url}/api/services/notify/${recipient}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${haSettings.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`Failed to send notification to HA: ${res.statusText}`);
  }
}