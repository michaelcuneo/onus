import { fail, redirect } from '@sveltejs/kit';
import { createOrganisation, organisationForUser } from '#lib/server/organisations.js';
import type { Actions, PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ locals }) => {
 if (await organisationForUser(locals.user!.id)) redirect(303, '/app');
};
export const actions = { default: async ({ request, locals }) => {
 const form = await request.formData();
 try { await createOrganisation(locals.user!, String(form.get('name') ?? '')); }
 catch (e) { return fail(400, { error: e instanceof Error ? e.message : 'Unable to create organisation.' }); }
 redirect(303, '/app');
} } satisfies Actions;
