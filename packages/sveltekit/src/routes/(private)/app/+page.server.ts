import { fail, redirect } from '@sveltejs/kit';
import { organisationForUser } from '#lib/server/organisations.js';
import { listProjects } from '#lib/server/projects.ts';
import { dailyWipForProject } from '#lib/server/daily-wip.js';
import { approveDailyWipAction, seedDailyWipDemo } from '#lib/server/daily-wip-actions.js';
import { projectLoadError } from '#lib/server/project-errors.ts';
import { ProjectError } from '#lib/projects.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) redirect(303, '/login');
  const organisation = await organisationForUser(locals.user.id);
  if (!organisation) redirect(303, '/onboarding');
  try {
    const projects = (await listProjects(locals.user.id)).filter((project) => !project.archivedAt);
    const workflows = await Promise.all(projects.map(async (project) => {
      const wip = await dailyWipForProject(locals.user!.id, project.id);
      return {
        projectId: project.id,
        projectName: project.name,
        canManage: wip.canManage,
        workItems: wip.workItems,
        proposedActions: wip.proposedActions,
        events: wip.events
      };
    }));
    return { organisation, projectCount: projects.length, workflows };
  } catch (cause) {
    projectLoadError(cause);
  }
};

export const actions: Actions = {
  seed: async ({ locals, request }) => {
    if (!locals.user) redirect(303, '/login');
    const projectId = (await request.formData()).get('projectId');
    if (typeof projectId !== 'string') return fail(400, { error: 'Select a project.' });
    try {
      await seedDailyWipDemo(locals.user.id, projectId);
      return { message: 'Demonstration workflow loaded.' };
    } catch (cause) {
      if (cause instanceof ProjectError) return fail(cause.status, { error: cause.message });
      console.error('ONUS demo seed failed', cause);
      return fail(500, { error: 'Unable to load the demonstration.' });
    }
  },
  approve: async ({ locals, request }) => {
    if (!locals.user) redirect(303, '/login');
    const data = await request.formData();
    const projectId = data.get('projectId');
    const actionId = data.get('actionId');
    if (typeof projectId !== 'string' || typeof actionId !== 'string')
      return fail(400, { error: 'Missing project or action.' });
    try {
      await approveDailyWipAction(locals.user.id, projectId, actionId);
      return { message: 'Follow-up approved and audited. No external notification sent.' };
    } catch (cause) {
      if (cause instanceof ProjectError) return fail(cause.status, { error: cause.message });
      console.error('ONUS action approval failed', cause);
      return fail(500, { error: 'Unable to approve the action.' });
    }
  }
};
