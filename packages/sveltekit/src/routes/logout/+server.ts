import { redirect } from '@sveltejs/kit';
import { logoutUser } from '#lib/server/auth.js';
import type { RequestHandler } from './$types';
export const POST: RequestHandler = async ({ cookies }) => { await logoutUser(cookies); redirect(303, '/login'); };
