import { fail, redirect } from '@sveltejs/kit';
import { verifyEmail, resendVerification } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';
export const load: PageServerLoad = ({ url, locals }) => { if (locals.user) redirect(303, '/app'); return { email: url.searchParams.get('email') ?? '' }; };
export const actions = {
 default: async ({ request, cookies }) => {
  const form = await request.formData(); const email = String(form.get('email') ?? '');
  try { await verifyEmail(email, String(form.get('code') ?? ''), cookies); }
  catch { return fail(400, { error: 'Invalid or expired verification code.', email }); }
  redirect(303, '/app');
 },
 resend: async ({ request }) => {
  const form = await request.formData(); const email = String(form.get('email') ?? '');
  try { await resendVerification(email); } catch { /* Do not reveal account state. */ }
  return { message: 'If the account is awaiting verification, a code has been sent.', email };
 }
} satisfies Actions;
