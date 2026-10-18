import { randomUUID } from 'node:crypto';
import { DynamoDBClient, TransactionCanceledException } from '@aws-sdk/client-dynamodb';
import {
	DynamoDBDocumentClient,
	GetCommand,
	QueryCommand,
	TransactWriteCommand,
	type QueryCommandInput,
	type TransactWriteCommandInput
} from '@aws-sdk/lib-dynamodb';
import { Resource } from 'sst';
import { ProjectError, validateProject, type Project, type ProjectInput } from '../projects.ts';
import {
	organisationForUser,
	type OrganisationMembership,
	type OrganisationRole
} from './organisations.ts';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const table = Resource.OnusProjectsData.name;
const authTable = Resource.OnusAuthData.name;
const managerRoles: OrganisationRole[] = ['OWNER', 'ADMIN', 'PROJECT_MANAGER'];
const projectKey = (organisationId: string, id: string) => ({
	pk: `ORG#${organisationId}#PROJECT#${id}`,
	sk: 'PROFILE'
});
const memberKey = (organisationId: string, id: string, userId: string) => ({
	pk: projectKey(organisationId, id).pk,
	sk: `MEMBER#${userId}`
});
const accessKey = (organisationId: string, userId: string, id: string) => ({
	pk: `ORG#${organisationId}#USER#${userId}`,
	sk: `PROJECT#${id}`
});

export function canCreateProjects(role: OrganisationRole) {
	return managerRoles.includes(role);
}

export async function projectContext(userId: string) {
	const organisation = await organisationForUser(userId);
	if (!organisation) throw new ProjectError(403, 'An active organisation membership is required.');
	return organisation;
}

function organisationChecks(
	userId: string,
	organisation: OrganisationMembership
): NonNullable<TransactWriteCommandInput['TransactItems']> {
	return [
		{
			ConditionCheck: {
				TableName: authTable,
				Key: { pk: `ORG#${organisation.organisationId}`, sk: 'PROFILE' },
				ConditionExpression: '#status = :active',
				ExpressionAttributeNames: { '#status': 'status' },
				ExpressionAttributeValues: { ':active': 'ACTIVE' }
			}
		},
		{
			ConditionCheck: {
				TableName: authTable,
				Key: { pk: `USER#${userId}`, sk: `ORG#${organisation.organisationId}` },
				ConditionExpression: '#status = :active AND #role = :role',
				ExpressionAttributeNames: { '#status': 'status', '#role': 'role' },
				ExpressionAttributeValues: { ':active': 'ACTIVE', ':role': organisation.role }
			}
		}
	];
}

async function write(items: NonNullable<TransactWriteCommandInput['TransactItems']>) {
	try {
		await db.send(new TransactWriteCommand({ TransactItems: items }));
	} catch (cause) {
		if (
			cause instanceof TransactionCanceledException &&
			cause.CancellationReasons?.some((reason) => reason.Code === 'ConditionalCheckFailed')
		) {
			throw new ProjectError(
				409,
				'The project or your access changed. Reload the page before trying again.',
				{ cause }
			);
		}
		throw cause;
	}
}

export async function getProject(userId: string, id: string) {
	const organisation = await projectContext(userId);
	if (!/^[0-9a-f-]{36}$/.test(id)) throw new ProjectError(404, 'Project not found.');
	const membership = await db.send(
		new GetCommand({
			TableName: table,
			Key: memberKey(organisation.organisationId, id, userId),
			ConsistentRead: true
		})
	);
	if (membership.Item?.status !== 'ACTIVE') throw new ProjectError(404, 'Project not found.');
	const result = await db.send(
		new GetCommand({
			TableName: table,
			Key: projectKey(organisation.organisationId, id),
			ConsistentRead: true
		})
	);
	if (!result.Item) throw new ProjectError(404, 'Project not found.');
	const project = result.Item as Project;
	return {
		project,
		organisation,
		canManage: canCreateProjects(organisation.role) && membership.Item.role === 'MANAGER'
	};
}

export async function listProjects(userId: string) {
	const organisation = await projectContext(userId);
	const projects: Project[] = [];
	let cursor: QueryCommandInput['ExclusiveStartKey'];
	do {
		const result = await db.send(
			new QueryCommand({
				TableName: table,
				KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
				ExpressionAttributeValues: {
					':pk': `ORG#${organisation.organisationId}#USER#${userId}`,
					':prefix': 'PROJECT#'
				},
				ExclusiveStartKey: cursor,
				Limit: 50,
				ConsistentRead: true
			})
		);
		for (const item of result.Items ?? []) {
			try {
				const { project } = await getProject(userId, String(item.projectId));
				projects.push(project);
			} catch (cause) {
				// Stale listing references must not expose projects after access is revoked.
				if (!(cause instanceof ProjectError && cause.status === 404)) throw cause;
			}
		}
		cursor = result.LastEvaluatedKey;
	} while (cursor);
	return projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function createProject(userId: string, input: ProjectInput) {
	const organisation = await projectContext(userId);
	if (!canCreateProjects(organisation.role))
		throw new ProjectError(403, 'Your organisation role cannot create projects.');
	const fields = validateProject(input);
	const id = randomUUID();
	const now = new Date().toISOString();
	const project: Project = {
		...fields,
		id,
		organisationId: organisation.organisationId,
		version: 1,
		createdAt: now,
		createdBy: userId,
		updatedAt: now,
		updatedBy: userId,
		archivedAt: null
	};
	await write([
		...organisationChecks(userId, organisation),
		{
			Put: {
				TableName: table,
				Item: { ...projectKey(organisation.organisationId, id), ...project },
				ConditionExpression: 'attribute_not_exists(pk)'
			}
		},
		{
			Put: {
				TableName: table,
				Item: {
					...memberKey(organisation.organisationId, id, userId),
					status: 'ACTIVE',
					role: 'MANAGER',
					createdAt: now
				},
				ConditionExpression: 'attribute_not_exists(pk)'
			}
		},
		{
			Put: {
				TableName: table,
				Item: { ...accessKey(organisation.organisationId, userId, id), projectId: id },
				ConditionExpression: 'attribute_not_exists(pk)'
			}
		}
	]);
	return project;
}

async function saveProject(
	userId: string,
	id: string,
	version: number,
	change: (project: Project) => Project
) {
	const { project, organisation, canManage } = await getProject(userId, id);
	if (!canManage)
		throw new ProjectError(403, 'Your project and organisation roles do not permit this change.');
	if (!Number.isSafeInteger(version) || version < 1)
		throw new ProjectError(400, 'Invalid project version.');
	if (project.version !== version)
		throw new ProjectError(
			409,
			'This project was changed by another request. Reload before saving.'
		);
	const updated = {
		...change(project),
		version: version + 1,
		updatedAt: new Date().toISOString(),
		updatedBy: userId
	};
	await write([
		...organisationChecks(userId, organisation),
		{
			ConditionCheck: {
				TableName: table,
				Key: memberKey(organisation.organisationId, id, userId),
				ConditionExpression: '#status = :active AND #role = :manager',
				ExpressionAttributeNames: { '#status': 'status', '#role': 'role' },
				ExpressionAttributeValues: { ':active': 'ACTIVE', ':manager': 'MANAGER' }
			}
		},
		{
			Put: {
				TableName: table,
				Item: { ...projectKey(organisation.organisationId, id), ...updated },
				ConditionExpression: '#version = :version',
				ExpressionAttributeNames: { '#version': 'version' },
				ExpressionAttributeValues: { ':version': version }
			}
		}
	]);
	return updated;
}

export function updateProject(userId: string, id: string, version: number, input: ProjectInput) {
	return saveProject(userId, id, version, (project) => {
		if (project.archivedAt) throw new ProjectError(409, 'Restore this project before editing it.');
		return { ...project, ...validateProject(input) };
	});
}

export function setProjectArchived(userId: string, id: string, version: number, archived: boolean) {
	return saveProject(userId, id, version, (project) => {
		if (Boolean(project.archivedAt) === archived)
			throw new ProjectError(409, 'The archive state already changed. Reload the project.');
		return { ...project, archivedAt: archived ? new Date().toISOString() : null };
	});
}
