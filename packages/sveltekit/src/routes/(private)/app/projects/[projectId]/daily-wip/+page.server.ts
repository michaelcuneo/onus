import { redirect } from '@sveltejs/kit';
import { dailyWipForProject } from '#lib/server/daily-wip.js';
import { projectLoadError } from '#lib/server/project-errors.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user) redirect(303, '/login');
  try {
    return await dailyWipForProject(locals.user.id, params.projectId);
  } catch (cause) {
    projectLoadError(cause);
  }
};
