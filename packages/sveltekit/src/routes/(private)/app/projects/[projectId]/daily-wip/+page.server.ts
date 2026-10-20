import { fail, redirect } from '@sveltejs/kit';
import { dailyWipForProject } from '#lib/server/daily-wip.js';
import { approveDailyWipAction, seedDailyWipDemo } from '#lib/server/daily-wip-actions.js';
import { projectLoadError } from '#lib/server/project-errors.js';
import { ProjectError } from '#lib/projects.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user) redirect(303, '/login');
  try {
    return await dailyWipForProject(locals.user.id, params.projectId);
  } catch (cause) {
    projectLoadError(cause);
  }
};

export const actions: Actions = {
  seed: async ({ locals, params }) => {
    if (!locals.user) redirect(303, '/login');
    try {
      await seedDailyWipDemo(locals.user.id, params.projectId);
      return { message: 'Demo workflow is ready.' };
    } catch (cause) {
      if (cause instanceof ProjectError) return fail(cause.status, { error: cause.message });
      console.error('ONUS demo seed failed', cause);
      return fail(500, { error: 'Unable to create demo workflow.' });
    }
  },
  approve: async ({ locals, params, request }) => {
    if (!locals.user) redirect(303, '/login');
    const form = await request.formData();
    const actionId = form.get('actionId');
    if (typeof actionId !== 'string') return fail(400, { error: 'Missing action.' });
    try {
      await approveDailyWipAction(locals.user.id, params.projectId, actionId);
      return { message: 'Action approved and recorded in the audit trail. No message has been sent.' };
    } catch (cause) {
      if (cause instanceof ProjectError) return fail(cause.status, { error: cause.message });
      console.error('ONUS action approval failed', cause);
      return fail(500, { error: 'Unable to approve action.' });
    }
  }
};
