import { redirect } from '@sveltejs/kit';
import { organisationForUser } from '#lib/server/organisations.js';
import { listProjects } from '#lib/server/projects.ts';
import { projectLoadError } from '#lib/server/project-errors.ts';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(303, '/login');
	const organisation = await organisationForUser(locals.user!.id);
	if (!organisation) redirect(303, '/onboarding');
	try {
		const projects = await listProjects(locals.user.id);
		return { organisation, projectCount: projects.filter((project) => !project.archivedAt).length };
	} catch (cause) {
		projectLoadError(cause);
	}
};
