import { error, fail } from '@sveltejs/kit';
import { ProjectError, type ProjectInput } from '../projects.ts';

export function projectLoadError(cause: unknown): never {
	if (cause instanceof ProjectError) error(cause.status, cause.message);
	console.error('ONUS project request failed', cause);
	error(500, 'Unable to load project data. Please try again.');
}

export function projectActionError(
	cause: unknown,
	details: { values?: ProjectInput; version?: number } = {}
) {
	if (cause instanceof ProjectError)
		return fail(cause.status, { error: cause.message, ...details });
	console.error('ONUS project change failed', cause);
	return fail(500, { error: 'Unable to save the project. Please try again.', ...details });
}
