import { db } from "$lib/server/db";
import { target } from "$lib/server/db/schema";
import type { TargetType } from "$lib/targets/types";
import { fail, type Actions, type ServerLoad } from "@sveltejs/kit";
import { eq } from "drizzle-orm";


export const load: ServerLoad = async () => {
  const targets = await db.query.target.findMany();
  return {
    targets
  }
}

export const actions = {
  new: async ({ request }) => {
    const data = await request.formData();
    const title = data.get("title") as string;

    if(!title || title.trim() === "") {
      return fail(400, { message: "Title is required" });
    }

    const defaultTarget: TargetType = "webhook";

    await db.insert(target).values({
      title: title.trim(),
      settings: JSON.stringify({}), // default empty settings,
      targetImpl: defaultTarget
    });

    return { success: true, message: "Target created" };
  },
  delete: async ({ request }) => {
    const data = await request.formData();
    const id = data.get("id") as string;

    if(!id) {
      return fail(400, { message: "ID is required" });
    }

    const res = await db.delete(target).where(eq(target.id, id));

    if(res.rowsAffected === 0) {
      return fail(404, { message: "Target not found" });
    } else {
      return { success: true, message: "Target deleted" };
    }
  }
} satisfies Actions;