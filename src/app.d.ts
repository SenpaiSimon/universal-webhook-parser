// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Session, User } from "better-auth";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session;
			user: User;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	namespace NodeJS {
		interface ProcessEnv {
			DATABASE_URL: string;
			BETTER_AUTH_SECRET?: string | undefined;
			BETTER_AUTH_URL?: string | undefined;
		}
	}
}

export {};
