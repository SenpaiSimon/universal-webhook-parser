import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../server/db";
import { passkey } from "@better-auth/passkey";
import { genericOAuth } from "better-auth/plugins";
import { OIDC_ID } from "./constants";

export async function LoadOidc() {
  // find oauth plugin
  let oidc = auth.options.plugins.find((plugin) => plugin.id === "generic-oauth");

  if(!oidc) {
    return;
  }

  const settings = await db.query.settingsOidc.findFirst();

  if(!settings) {
    return;
  }

  if(settings.clientId.length <= 0 && settings.clientSecret.length <= 0 && settings.issuer.length <= 0) {
    return;
  }

  oidc.options.config = []; // empty old settings

  oidc.options.config.push({
    providerId: OIDC_ID,
    clientId: settings.clientId,
    clientSecret: settings.clientSecret,
    discoveryUrl: settings.issuer,
    disableSignUp: true,
    disableImplicitSignUp: true
  });

  console.log("Loaded OIDC Config");
}

export async function LoadPasswordAuthSettings() {
  const settings = await db.query.settingsGeneral.findFirst({
    columns: {
      disablePasswordAuth: true
    }
  });

  if(!settings) {
    return;
  }

  auth.options.emailAndPassword.enabled = !settings.disablePasswordAuth;

  console.log("Loaded Password Auth Settings");
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "MySuperLongBuildSecret",
  database: drizzleAdapter(db, {
    provider: "sqlite"
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true as boolean
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL || ''],
	advanced: {
		useSecureCookies: process.env.NODE_ENV === 'production',
	},
  rateLimit: {
		window: 60,
		maxRequests: 100,
	},
  plugins: [
    passkey(),
    genericOAuth({
      config: []
    })
  ]
});