import { db, hooks, parser, target } from "$lib/server/db";
import { fail, type Actions, type ServerLoad } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const load: ServerLoad = async () => {
  const allParsers = await db.query.parser.findMany();
  const allTargets = await db.query.target.findMany();
  const allHooks = await db.query.hooks.findMany();

  return {
    parsers: allParsers,
    targets: allTargets,
    hooks: allHooks
  }
}

export const actions= {
  new: async ({ request }) => {
    const data = await request.formData();
    const title = data.get("title") as string;

    // check if parser and target even exist
    const foundParser = await db.query.parser.findFirst();
    const foundTarget = await db.query.target.findFirst();

    if(!foundParser || !foundTarget) {
      return fail(400, { message: "No Parsers and Targets found" });
    }

    const res = await db.insert(hooks).values({
      title,
      description: "",
      parserId: foundParser.id,
      targetId: foundTarget.id
    });

    if(res.changes === 0) {
      return fail(400, { message: "Failed to create hook" });
    } else {
      return { success: true, message: "Hook created" };
    }
  } ,
  delete: async ({ request }) => {
    const data = await request.formData();
    const id = data.get("id") as string;

    const res = await db.delete(hooks).where(eq(hooks.id, id));

    if(res.changes === 0) {
      return fail(404, { message: "Hook not found" });
    } else {
      return { success: true, message: "Hook deleted" };
    }
  }
} satisfies Actions;