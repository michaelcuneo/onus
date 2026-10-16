import { redirect } from '@sveltejs/kit';
import { organisationForUser } from '#lib/server/organisations.js';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ locals }) => {
 const organisation = await organisationForUser(locals.user!.id);
 if (!organisation) redirect(303, '/onboarding');
 return { organisation };
};
