export const projectStatuses = ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED'] as const;
export type ProjectStatus = (typeof projectStatuses)[number];

export const projectStatusLabels: Record<ProjectStatus, string> = {
	PLANNING: 'Planning',
	ACTIVE: 'Active',
	ON_HOLD: 'On hold',
	COMPLETED: 'Completed'
};

export type ProjectInput = {
	name: string;
	reference: string;
	client: string;
	location: string;
	description: string;
	startDate: string;
	targetDate: string;
	status: string;
};

export type Project = Omit<ProjectInput, 'status'> & {
	id: string;
	organisationId: string;
	status: ProjectStatus;
	version: number;
	createdAt: string;
	createdBy: string;
	updatedAt: string;
	updatedBy: string;
	archivedAt: string | null;
};

export class ProjectError extends Error {
	public status: 400 | 403 | 404 | 409;

	constructor(status: 400 | 403 | 404 | 409, message: string, options?: ErrorOptions) {
		super(message, options);
		this.status = status;
	}
}

export function projectInput(form: FormData): ProjectInput {
	const text = (key: string) => {
		const value = form.get(key);
		if (typeof value !== 'string') throw new ProjectError(400, `Missing project field: ${key}.`);
		return value;
	};
	return {
		name: text('name'),
		reference: text('reference'),
		client: text('client'),
		location: text('location'),
		description: text('description'),
		startDate: text('startDate'),
		targetDate: text('targetDate'),
		status: text('status')
	};
}

export function validateProject(
	input: ProjectInput
): Omit<ProjectInput, 'status'> & { status: ProjectStatus } {
	const fields = {
		name: input.name.trim(),
		reference: input.reference.trim(),
		client: input.client.trim(),
		location: input.location.trim(),
		description: input.description.trim(),
		startDate: input.startDate.trim(),
		targetDate: input.targetDate.trim()
	};
	if (fields.name.length < 2 || fields.name.length > 120) {
		throw new ProjectError(400, 'Project name must be between 2 and 120 characters.');
	}
	for (const [label, value, max] of [
		['Reference', fields.reference, 40],
		['Client', fields.client, 120],
		['Location', fields.location, 240],
		['Description', fields.description, 4000]
	] as const) {
		if (value.length > max)
			throw new ProjectError(400, `${label} must be ${max} characters or fewer.`);
	}
	const status = projectStatuses.find((candidate) => candidate === input.status);
	if (!status) throw new ProjectError(400, 'Choose a valid project status.');
	for (const [label, date] of [
		['Start date', fields.startDate],
		['Target date', fields.targetDate]
	]) {
		if (!date) continue;
		const parsed = new Date(`${date}T00:00:00Z`);
		if (
			!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
			!Number.isFinite(parsed.getTime()) ||
			parsed.toISOString().slice(0, 10) !== date ||
			date < '0001-01-01'
		) {
			throw new ProjectError(400, `${label} must be a valid calendar date.`);
		}
	}
	if (fields.startDate && fields.targetDate && fields.targetDate < fields.startDate) {
		throw new ProjectError(400, 'Target date cannot be before the start date.');
	}
	return { ...fields, status };
}

export function projectVersion(value: FormDataEntryValue | null): number {
	if (
		typeof value !== 'string' ||
		!/^[1-9]\d*$/.test(value) ||
		!Number.isSafeInteger(Number(value))
	) {
		throw new ProjectError(400, 'Invalid project version. Reload the page and try again.');
	}
	return Number(value);
}
