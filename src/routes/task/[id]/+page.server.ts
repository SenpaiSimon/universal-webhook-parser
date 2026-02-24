import { db, hooks, task } from "$lib/server/db";
import { redirect, type ServerLoad } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

async function getHookName(hookId: string) {
  const res = await db.query.hooks.findFirst({
    where: eq(hooks.id, hookId),
    columns: {
      title: true
    }
  })

  return res?.title || hookId;
}

export const load: ServerLoad = async ({ params }) => {
  const id = params.id as string;

  const taskEntry = await db.query.task.findFirst({
    where: eq(task.id, id)
  })

  if(!taskEntry) {
    throw redirect(302, '/');
  }

  const name = await getHookName(taskEntry?.hookId || "");

  return {
    task: taskEntry,
    name
  }
}