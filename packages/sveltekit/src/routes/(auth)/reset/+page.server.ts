import { fail } from '@sveltejs/kit';
import { requestPasswordReset, resetPassword } from '$lib/server/auth';
import type { Actions } from './$types';
export const actions = {
 request: async ({ request }) => { const form = await request.formData(); const email = String(form.get('email') ?? '');
  try { await requestPasswordReset(email); } catch (e) { if (e instanceof Error && e.message.includes('wait a minute')) return fail(429, { error: 'Please wait before requesting another code.', email }); }
  return { email, message: 'If this account exists, a reset code has been sent.' };
 },
 confirm: async ({ request }) => { const form = await request.formData(); const email = String(form.get('email') ?? '');
  try { await resetPassword(email, String(form.get('code') ?? ''), String(form.get('password') ?? '')); }
  catch { return fail(400, { email, error: 'Unable to reset password. Check the code and password requirements.' }); }
  return { email, message: 'Password updated. Sign in with your new password.' };
 }
} satisfies Actions;
