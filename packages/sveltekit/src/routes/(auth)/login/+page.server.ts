import { fail, redirect } from '@sveltejs/kit';
import { loginUser } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';
export const load: PageServerLoad = ({ locals }) => { if (locals.user) redirect(303, '/app'); };
export const actions = { default: async ({ request, cookies }) => {
 const form = await request.formData(); const email = String(form.get('email') ?? '');
 try { await loginUser(email, String(form.get('password') ?? ''), cookies); }
 catch (e) { return fail(401, { error: e instanceof Error && e.message.startsWith('Too many') ? e.message : 'Invalid credentials or an unverified account.', email }); }
 redirect(303, '/app');
} } satisfies Actions;
