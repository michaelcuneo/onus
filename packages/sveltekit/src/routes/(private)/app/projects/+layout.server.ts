import { redirect } from '@sveltejs/kit';
import { canCreateProjects, projectContext } from '#lib/server/projects.ts';
import { projectLoadError } from '#lib/server/project-errors.ts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(303, '/login');
	try {
		const organisation = await projectContext(locals.user.id);
		return { organisation, canCreate: canCreateProjects(organisation.role) };
	} catch (cause) {
		projectLoadError(cause);
	}
};
