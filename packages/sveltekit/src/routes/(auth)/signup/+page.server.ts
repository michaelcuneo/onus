import { fail, redirect } from '@sveltejs/kit';
import { registerUser } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';
export const load: PageServerLoad = ({ locals }) => { if (locals.user) redirect(303, '/app'); };
export const actions = { default: async ({ request }) => {
  const form = await request.formData();
  const name = String(form.get('name') ?? '');
  const email = String(form.get('email') ?? '');
  const password = String(form.get('password') ?? '');
  try { await registerUser({ name, email, password }); }
  catch (e) { return fail(400, { error: e instanceof Error ? e.message : 'Unable to register.', name, email }); }
  redirect(303, '/verify?email=' + encodeURIComponent(email));
} } satisfies Actions;
