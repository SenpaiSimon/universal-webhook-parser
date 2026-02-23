import { db } from "$lib/server/db";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ locals }) => {
  const res = await db.query.user.findFirst();

  // if this is not there... we dont have any users
  let signUp = false;
  if(!res) {
    console.log("Start SignUp Process");
    signUp = true;
  }

  // oidc stuff
  const oidcSettings = await db.query.settingsOidc.findFirst();
  const frontEndOidc = {
    name: oidcSettings?.name || "",
    icon: oidcSettings?.iconSvg || ""
  }

  // pasword auth?
  let disablePasswordLogin = false;
  const settings = await db.query.settingsGeneral.findFirst({
    columns: {
      disablePasswordAuth: true
    }
  });

  if(settings) {
    disablePasswordLogin = settings.disablePasswordAuth;
  }

  return {
    signUp,
    user: locals.user,
    frontEndOidc,
    disablePasswordLogin
  }
};