import { db } from "$lib/server/db";
import { parser } from "$lib/server/db/schema";
import { fail, redirect, type Actions, type ServerLoad } from "@sveltejs/kit";
import { eq } from 'drizzle-orm';

export const load: ServerLoad = async ({ params }) => {
  const id = params.id as string;

  const parserEntry = await db.query.parser.findFirst({
    where: eq(parser.id, id)
  })

  if(!parserEntry) throw redirect(302, '/parsers'); // parser not found, redirect to parsers list

  return {
    parser: parserEntry
  }
}

export const actions = {
  update: async ({ request, params }) => {
    const id = params.id as string;
    const data = await request.formData();
    const title = data.get("title") as string;
    const code = data.get("encodedCode") as string;
    const description = data.get("description") as string;

    if(!title || title.trim() === "") {
      return fail(400, { message: "Title is required" });
    }

    if(!code || code.trim() === "") {
      return fail(400, { message: "Code is required" });
    }

    const res = await db.update(parser).set({
      title: title.trim(),
      code: code.trim(),
      description: description ? description.trim() : null
    }).where(eq(parser.id, id));

    if(res.changes === 0) {
      return fail(404, { message: "Parser not found" });
    } else {
      return { success: true, message: "Parser updated successfully" };
    }
  }
} satisfies Actions;