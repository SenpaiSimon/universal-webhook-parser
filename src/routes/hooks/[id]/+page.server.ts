import { db } from "$lib/server/db";
import { hooks, parser, target } from "$lib/server/db/schema";
import { fail, redirect, type Actions, type ServerLoad } from "@sveltejs/kit";
import { eq } from 'drizzle-orm';

export const load: ServerLoad = async ({ params }) => {
  const id = params.id as string;

  const hookEntry = await db.query.hooks.findFirst({
    where: eq(hooks.id, id)
  })

  if(!hookEntry) throw redirect(302, '/hooks'); 

  const allParsers = await db.query.parser.findMany();
  const allTargets = await db.query.target.findMany();

  return {
    hook: hookEntry,
    parsers: allParsers,
    targets: allTargets
  }
}

export const actions = {
  update: async ({ request, params }) => {
    const id = params.id as string;
    const data = await request.formData();
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const parserId = data.get("parserId") as string;
    const targetId = data.get("targetId") as string;

    // check if parser and target even exist
    const foundParser = await db.query.parser.findFirst({
      where: eq(parser.id, parserId)
    });
    const foundTarget = await db.query.target.findFirst({
      where: eq(target.id, targetId)
    });

    if(!foundParser || !foundTarget) {
      return fail(400, { message: "Parser or target not found" });
    }

    const res = await db.update(hooks).set({
      title,
      description,
      parserId,
      targetId
    }).where(eq(hooks.id, id));

    if(res.changes === 0) {
      return fail(400, { message: "Failed to update hook" });
    } else {
      return { success: true, message: "Hook updated" };
    }
  }
} satisfies Actions;