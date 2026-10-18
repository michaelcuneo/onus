import { redirect } from '@sveltejs/kit';
import { projectVersion } from '#lib/projects.ts';
import { getProject, setProjectArchived } from '#lib/server/projects.ts';
import { projectActionError, projectLoadError } from '#lib/server/project-errors.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) redirect(303, '/login');
	try {
		return await getProject(locals.user.id, params.projectId);
	} catch (cause) {
		projectLoadError(cause);
	}
};

export const actions = {
	archive: async ({ locals, params, request }) => {
		if (!locals.user) redirect(303, '/login');
		try {
			const form = await request.formData();
			await setProjectArchived(
				locals.user.id,
				params.projectId,
				projectVersion(form.get('version')),
				true
			);
			return { message: 'Project archived. Its details and membership have been retained.' };
		} catch (cause) {
			return projectActionError(cause);
		}
	},
	restore: async ({ locals, params, request }) => {
		if (!locals.user) redirect(303, '/login');
		try {
			const form = await request.formData();
			await setProjectArchived(
				locals.user.id,
				params.projectId,
				projectVersion(form.get('version')),
				false
			);
			return { message: 'Project restored.' };
		} catch (cause) {
			return projectActionError(cause);
		}
	}
} satisfies Actions;
