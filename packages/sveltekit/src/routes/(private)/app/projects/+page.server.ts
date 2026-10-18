import { redirect } from '@sveltejs/kit';
import { listProjects } from '#lib/server/projects.ts';
import { projectLoadError } from '#lib/server/project-errors.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(303, '/login');
	try {
		return { projects: await listProjects(locals.user.id) };
	} catch (cause) {
		projectLoadError(cause);
	}
};
