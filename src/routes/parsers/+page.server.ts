import { base64Encode } from "$lib/helpers/encoders";
import { db } from "$lib/server/db";
import { parser } from "$lib/server/db/schema";
import { fail, type Actions, type ServerLoad } from "@sveltejs/kit";
import { eq } from 'drizzle-orm';

export const load: ServerLoad = async () => {
  const parsers = await db.query.parser.findMany();
  return {
    parsers
  }
}

const getCodeTemplate = () => {
  const code = 
`
// these are typesafe
console.log(payload);        // this is what the webhook passed into here
console.log(result);         // please use this variable to enter your results
console.log(result.title);   // can be used to express some basic heading
console.log(result.message); // can be used to add a body to the message
console.log(result.payload); // here you can put any object as additional payload
console.log(result.action);  // this is used to signal what to to afterwards
// "error"    signals that something went from while parsing
// "skip"     signals that you dont want to enter the target stage and just let it be
// "continue" is the default and just carries on to the next stage
`

  return base64Encode(code.trim());
}

export const actions = {
  new: async ({ request }) => {
    const data = await request.formData();
    const title = data.get("title") as string;

    if(!title || title.trim() === "") {
      return fail(400, { message: "Title is required" });
    }

    await db.insert(parser).values({
      title: title.trim(),
      code: getCodeTemplate()
    });

    return { success: true, message: "Parser created" };
  },
  delete: async ({ request }) => {
    const data = await request.formData();
    const id = data.get("id") as string;

    if(!id) {
      return fail(400, { message: "ID is required" });
    }

    const res = await db.delete(parser).where(eq(parser.id, id));

    if(res.changes === 0) {
      return fail(404, { message: "Parser not found" });
    } else {
      return { success: true, message: "Parser deleted" };
    }
  }

} satisfies Actions;