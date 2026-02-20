import { db } from "$lib/server/db";
import { target } from "$lib/server/db/schema";
import { ALL_TARGET_TYPES, type TargetType } from "$lib/targets/types";
import { redirect, type Actions, type ServerLoad } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { OptionEntry } from "./+page.svelte";

function GetAllAvailableTargets(): TargetType[] {
  return [...ALL_TARGET_TYPES];
}

export const load: ServerLoad = async ({ params }) => {
  const id = params.id as string;

  const targetEntry = await db.query.target.findFirst({
    where: eq(target.id, id)
  })

  if(!targetEntry) throw redirect(302, '/targets'); // parser not found, redirect to parsers list

  return {
    target: targetEntry,
    availableTargets: GetAllAvailableTargets()
  }
}

export const actions = {
  update: async ({ request, params }) => {
    const id = params.id as string;
    const data = await request.formData();

    // title, desc and type are always there
    const title = data.get('title') as string;
    const desc = data.get('description') as string;
    const type = data.get('type') as string;

    // get the variable ones
    const settings = data.get('settings') as string;
    const parsedSettings = JSON.parse(settings) as OptionEntry[];

    let outSetting: any = {};

    // build a object with data from the parsedSettingsKeys
    for(const entry of parsedSettings) {
      const key = entry.key;
      const value = data.get(key) as string;
      outSetting[key] = value;
    }

    await db.update(target).set({
      title,
      description: desc,
      targetImpl: type,
      settings: JSON.stringify(outSetting)
    }).where(eq(target.id, id));

    return { success: true, message: 'Target updated'};
  }
} satisfies Actions;