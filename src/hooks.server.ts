import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from '$app/environment'
import { auth, LoadOidc, LoadPasswordAuthSettings } from "$lib/auth/auth";
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import type { Session, User } from "better-auth";
import { error, redirect, type Handle } from "@sveltejs/kit";

const limiter = new RateLimiter({
  IP: [60, 's'], // IP address limiter
  IPUA: [40, 's'], // IP + User Agent limiter
});

const unauthenticatedRoutes = ['/login', '/api'];

export const handle: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

  if(session) {
    event.locals.session = session.session as Session;
    event.locals.user = session.user as User;
  }

  if (await limiter.isLimited(event)) {
		throw error(429, 'Too Many Requests');
	} 

  // is it protected?
  let protectedRoute = true;
  if (unauthenticatedRoutes.some(route => event.url.pathname.startsWith(route))) {
    protectedRoute = false;
  }

  if(!session && protectedRoute) {
    const next = event.url.pathname + event.url.search;
    throw redirect(303, `/login?next=${encodeURIComponent(next)}`);
  }

  return svelteKitHandler({ event, resolve, auth, building });
}

export const init = async () => {
	await LoadOidc();
  await LoadPasswordAuthSettings();
};