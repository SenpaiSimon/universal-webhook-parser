import { db } from "$lib/server/db";
import { settingsEmail } from "$lib/server/db/schema";
import { fail, type Actions } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const load = async () => {
  let emailSettings = await db.query.settingsEmail.findFirst();

  // create empty entry if does not exist
  if(!emailSettings) {
    const res = await db.insert(settingsEmail).values({
      smtpPort: "587",
      smtpServer: "",
      username: "",
      password: "",
      fromAddress: "",
    }).returning();

    emailSettings = res[0];
  }

  return {
    emailSettings
  };
}

export const actions = {
  updateEmailSettings: async ({ request }) => {
    const formData = await request.formData();

    const id = formData.get("id") as string;
    const smtpServer = formData.get("smtpServer") as string;
    const smtpPort = formData.get("smtpPort") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const fromAddress = formData.get("fromAddress") as string;

    await db.update(settingsEmail).set({
      smtpServer,
      smtpPort,
      username,
      password,
      fromAddress
    }).where(eq(settingsEmail.id, id));

    return {
      success: true,
      message: "Updated"
    };
  }
} satisfies Actions;