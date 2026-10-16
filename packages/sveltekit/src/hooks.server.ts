import type { Handle } from '@sveltejs/kit';
import { getCurrentUser } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
  // SvelteKit already enforces origin checks for form posts. Cover JSON endpoints too.
  if (!['GET', 'HEAD', 'OPTIONS'].includes(event.request.method)) {
    const origin = event.request.headers.get('origin');
    if (origin && origin !== event.url.origin) {
      return new Response('Cross-origin request rejected.', { status: 403 });
    }
  }
  try {
    event.locals.user = await getCurrentUser(event.cookies);
  } catch (error) {
    console.error('ONUS session lookup failed', error);
    event.locals.user = null;
  }
  const response = await resolve(event);
  if (event.locals.user) {
    response.headers.set('cache-control', 'private, no-store');
  }
  return response;
};
