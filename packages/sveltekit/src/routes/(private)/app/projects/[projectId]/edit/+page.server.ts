import { redirect } from '@sveltejs/kit';
import { ProjectError, projectInput, projectVersion, type ProjectInput } from '#lib/projects.ts';
import { getProject, updateProject } from '#lib/server/projects.ts';
import { projectActionError, projectLoadError } from '#lib/server/project-errors.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) redirect(303, '/login');
	try {
		const result = await getProject(locals.user.id, params.projectId);
		if (!result.canManage)
			throw new ProjectError(403, 'You do not have permission to edit this project.');
		if (result.project.archivedAt)
			throw new ProjectError(409, 'Restore this project before editing it.');
		return result;
	} catch (cause) {
		projectLoadError(cause);
	}
};

export const actions = {
	default: async ({ locals, params, request }) => {
		if (!locals.user) redirect(303, '/login');
		let values: ProjectInput | undefined;
		let version: number | undefined;
		try {
			const form = await request.formData();
			values = projectInput(form);
			version = projectVersion(form.get('version'));
			await updateProject(locals.user.id, params.projectId, version, values);
		} catch (cause) {
			return projectActionError(cause, { values, version });
		}
		redirect(303, `/app/projects/${params.projectId}`);
	}
} satisfies Actions;
