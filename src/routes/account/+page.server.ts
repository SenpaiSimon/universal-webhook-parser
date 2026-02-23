import { account, db } from "$lib/server/db";
import type { ServerLoad } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

export const load: ServerLoad = async ({ locals }) => {
  const oidcSettings = await db.query.settingsOidc.findFirst();

  let oidcSetup = false;
  if(oidcSettings) {
    if(oidcSettings.clientId.length > 0 && oidcSettings.clientSecret.length > 0 && oidcSettings.issuer.length > 0) {
      oidcSetup = true;
    }
  }

  // check if the user already has oidc linked
  const accountEntry = await db.query.account.findFirst({
    where: and(eq(account.providerId, "oidc"), eq(account.userId, locals.user.id))
  });

  let alreadyLinked = false;
  if(accountEntry) {
    alreadyLinked = true;
  }

  return {
    user: locals.user,
    oidcSetup,
    oidcSettings,
    alreadyLinked
  }
}