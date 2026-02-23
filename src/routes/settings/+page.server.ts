import { LoadOidc, LoadPasswordAuthSettings } from "$lib/auth/auth";
import { db } from "$lib/server/db";
import { account, passkey, settingsEmail, settingsGeneral, settingsOidc } from "$lib/server/db/schema";
import { fail, type Actions } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

async function DisablePasswortAuthIsAllowed(userId: string): Promise<boolean> {
  // one can only disable password auth once at least one passkey or oidc is connected
  const passkeyCount = (await db.query.passkey.findMany({
    where: eq(passkey.userId, userId)
  })).length;

  const isOidcLinked = await db.query.account.findFirst({
    where: and(eq(account.providerId, "oidc"), eq(account.userId, userId))
  });

  if(passkeyCount > 0 || isOidcLinked) {
    return true;
  } else {
    return false;
  }
}

export const load = async () => {
  // email settings
  let emailSettings = await db.query.settingsEmail.findFirst();
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

  // oidc settings
  let oidcSettings = await db.query.settingsOidc.findFirst();
  if(!oidcSettings) {
    const res = await db.insert(settingsOidc).values({
      issuer: "",
      clientId: "",
      clientSecret: "",
      name: "",
      iconSvg: ""
    }).returning();

    oidcSettings = res[0];
  }

  // general settings
  let generalSettings = await db.query.settingsGeneral.findFirst();
  if(!generalSettings) {
    const res = await db.insert(settingsGeneral).values({
      disablePasswordAuth: false
    }).returning();

    generalSettings = res[0];
  }

  return {
    emailSettings,
    oidcSettings,
    generalSettings 
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
  },
  updateOidcSettings: async ({ request }) => {
    const formData = await request.formData();

    const id = formData.get("id") as string;
    const issuer = formData.get("issuer") as string;
    const clientId = formData.get("clientId") as string;
    const clientSecret = formData.get("clientSecret") as string;
    const name = formData.get("name") as string;
    const iconSvg = formData.get("iconSvg") as string;

    await db.update(settingsOidc).set({
      issuer,
      clientId,
      clientSecret,
      name,
      iconSvg
    }).where(eq(settingsOidc.id, id));

    // reload oidc
    LoadOidc();

    return {
      success: true,
      message: "Updated and reloaded"
    };
  },
  updateGeneralSettings: async ({ request, locals }) => {
    const formData = await request.formData();

    const id = formData.get("id") as string;
    const disablePasswordAuth = formData.get("disablePasswordAuth") as string;
    const disablePasswordAuthBool = disablePasswordAuth === "true";

    if(disablePasswordAuthBool) {
      const res = await DisablePasswortAuthIsAllowed(locals.user.id);

      if(!res) {
        return fail(400, { message: "Please at least create one passkey or link oidc to disable password auth"});
      }
    }

    await db.update(settingsGeneral).set({
      disablePasswordAuth: disablePasswordAuth === "true"
    }).where(eq(settingsGeneral.id, id));

    LoadPasswordAuthSettings();

    return {
      success: true,
      message: "Updated"
    };
  }
} satisfies Actions;