import { redirect } from '@sveltejs/kit';
import { organisationForUser } from '#lib/server/organisations.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(303, '/login');
	const organisation = await organisationForUser(locals.user.id);
	if (!organisation) redirect(303, '/onboarding');
	return { organisation };
};
