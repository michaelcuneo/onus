import { redirect } from '@sveltejs/kit';
import { ProjectError, projectInput, type ProjectInput } from '#lib/projects.ts';
import { canCreateProjects, createProject, projectContext } from '#lib/server/projects.ts';
import { projectActionError, projectLoadError } from '#lib/server/project-errors.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(303, '/login');
	try {
		const organisation = await projectContext(locals.user.id);
		if (!canCreateProjects(organisation.role))
			throw new ProjectError(403, 'Your organisation role cannot create projects.');
	} catch (cause) {
		projectLoadError(cause);
	}
};

export const actions = {
	default: async ({ locals, request }) => {
		if (!locals.user) redirect(303, '/login');
		const form = await request.formData();
		let id: string;
		let values: ProjectInput | undefined;
		try {
			values = projectInput(form);
			id = (await createProject(locals.user.id, values)).id;
		} catch (cause) {
			return projectActionError(cause, { values });
		}
		redirect(303, `/app/projects/${id}`);
	}
} satisfies Actions;
