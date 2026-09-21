import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../server/db';
import { passkey } from '@better-auth/passkey';
import { genericOAuth } from 'better-auth/plugins';
import { OIDC_ID } from './constants';

export async function createAuth() {
	const settings = await db.query.settingsOidc.findFirst();
	const oidcConfig =
		settings && settings.clientId && settings.clientSecret && settings.issuer
			? [
					{
						providerId: OIDC_ID,
						clientId: settings.clientId,
						clientSecret: settings.clientSecret,
						discoveryUrl: settings.issuer,
						scopes: ['openid', 'profile', 'email'],
						mapProfileToUser: (profile: Record<string, any>) => ({
							email: profile.email
							// emailVerified: Boolean(profile.email_verified)
						}),
						disableSignUp: true,
						disableImplicitSignUp: true
					}
				]
			: [];

	return betterAuth({
		secret: process.env.BETTER_AUTH_SECRET || 'MySuperLongBuildSecret',
		database: drizzleAdapter(db, {
			provider: 'sqlite'
		}),
		baseURL: process.env.BETTER_AUTH_URL,
		emailAndPassword: {
			enabled: true as boolean
		},
		account: {
			accountLinking: {
				trustedProviders: [OIDC_ID]
			}
		},
		trustedOrigins: [process.env.BETTER_AUTH_URL || ''],
		advanced: {
			useSecureCookies: process.env.NODE_ENV === 'production'
		},
		rateLimit: {
			window: 60,
			maxRequests: 100
		},
		plugins: [
			passkey(),
			genericOAuth({
				config: oidcConfig
			})
		]
	});
}

export let auth: Awaited<ReturnType<typeof createAuth>> | null = null;

export async function getAuth() {
	if (!auth) {
		auth = await createAuth();
	}
	return auth;
}

export async function reloadAuth() {
	auth = await createAuth();
}

export async function LoadOidc() {
	const authInstance = await getAuth();
	const oidc = authInstance.options.plugins.find((plugin) => plugin.id === 'generic-oauth');

	if (!oidc) {
		return;
	}

	const settings = await db.query.settingsOidc.findFirst();

	if (!settings) {
		oidc.options.config = [];
		authInstance.options.account = {
			...authInstance.options.account,
			accountLinking: {
				...authInstance.options.account?.accountLinking,
				trustedProviders: []
			}
		};
		return;
	}

	if (
		settings.clientId.length <= 0 &&
		settings.clientSecret.length <= 0 &&
		settings.issuer.length <= 0
	) {
		oidc.options.config = [];
		authInstance.options.account = {
			...authInstance.options.account,
			accountLinking: {
				...authInstance.options.account?.accountLinking,
				trustedProviders: []
			}
		};
		return;
	}

	authInstance.options.account = {
		...authInstance.options.account,
		accountLinking: {
			...authInstance.options.account?.accountLinking,
			trustedProviders: [OIDC_ID]
		}
	};

	oidc.options.config = [
		{
			providerId: OIDC_ID,
			clientId: settings.clientId,
			clientSecret: settings.clientSecret,
			discoveryUrl: settings.issuer,
			scopes: ['openid', 'profile', 'email'],
			mapProfileToUser: (profile: Record<string, any>) => ({
				email: profile.email
				// emailVerified: Boolean(profile.email_verified)
			}),
			disableSignUp: true,
			disableImplicitSignUp: true
		}
	];

	console.log('Loaded OIDC Config');
}

export async function LoadPasswordAuthSettings() {
	const authInstance = await getAuth();
	const settings = await db.query.settingsGeneral.findFirst({
		columns: {
			disablePasswordAuth: true
		}
	});

	if (!settings) {
		return;
	}

	authInstance.options.emailAndPassword.enabled = !settings.disablePasswordAuth;

	console.log('Loaded Password Auth Settings');
}
