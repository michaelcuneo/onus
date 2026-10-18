import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test from 'node:test';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand
} from '@aws-sdk/lib-dynamodb';
import { Resource } from 'sst';
import {
	ProjectError,
	projectInput,
	projectVersion,
	validateProject,
	type ProjectInput
} from '../src/lib/projects.ts';
import { createOrganisation } from '../src/lib/server/organisations.ts';
import {
	createProject,
	getProject,
	listProjects,
	setProjectArchived,
	updateProject
} from '../src/lib/server/projects.ts';

const input: ProjectInput = {
	name: ' Riverside development ',
	reference: 'RIV-001',
	client: 'Example client',
	location: 'Newcastle',
	description: 'A fictional project for automated testing.',
	startDate: '2026-10-01',
	targetDate: '2027-03-31',
	status: 'PLANNING'
};
const expectError = (status: number) => (error: unknown) =>
	error instanceof ProjectError && error.status === status;

test('project input validation', () => {
	assert.equal(validateProject(input).name, 'Riverside development');
	const boundaryInput = {
		...input,
		name: 'x'.repeat(120),
		reference: 'x'.repeat(40),
		client: 'x'.repeat(120),
		location: 'x'.repeat(240),
		description: 'x'.repeat(4000)
	};
	assert.deepEqual(validateProject(boundaryInput), boundaryInput);
	assert.equal(validateProject({ ...input, name: 'OK' }).name, 'OK');
	assert.equal(validateProject({ ...input, startDate: '', targetDate: '' }).startDate, '');
	for (const patch of [
		{ name: ' ' },
		{ name: 'x' },
		{ name: 'x'.repeat(121) },
		{ reference: 'x'.repeat(41) },
		{ client: 'x'.repeat(121) },
		{ location: 'x'.repeat(241) },
		{ description: 'x'.repeat(4001) },
		{ status: 'UNKNOWN' },
		{ startDate: '2026-02-30' },
		{ targetDate: '2026-09-30' },
		{ startDate: '2026-2-01' },
		{ startDate: '0000-01-01' },
		{ startDate: 'invalid' }
	]) {
		assert.throws(() => validateProject({ ...input, ...patch }), expectError(400));
	}
	assert.equal(
		validateProject({ ...input, startDate: '2028-02-29', targetDate: '2028-03-01' }).startDate,
		'2028-02-29'
	);
	assert.equal(projectVersion('12'), 12);
	for (const value of [null, '', '-1', '0', '1.5', '1e2', '9007199254740992']) {
		assert.throws(() => projectVersion(value), expectError(400));
	}
	assert.throws(() => projectInput(new FormData()), expectError(400));
	const form = new FormData();
	for (const [key, value] of Object.entries(input)) form.set(key, value);
	assert.deepEqual(projectInput(form), input);
	form.set('name', new Blob(['not a string']), 'name.txt');
	assert.throws(() => projectInput(form), expectError(400));
});

test('project persistence, lifecycle and explicit access (SST dev resources)', async (t) => {
	const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
	const authTable = Resource.OnusAuthData.name;
	const projectsTable = Resource.OnusProjectsData.name;
	const cleanup: { table: string; pk: string; sk: string }[] = [];
	const user = (name: string) => ({
		id: randomUUID(),
		name,
		email: `${randomUUID()}@example.invalid`,
		emailVerified: true,
		createdAt: new Date().toISOString()
	});
	const owner = user('Project test creator');
	const otherOwner = user('Project test unassigned owner');
	const viewer = user('Project test reader');
	const outsider = user('Project test other organisation');
	t.after(async () => {
		for (const key of cleanup.reverse()) {
			await db.send(new DeleteCommand({ TableName: key.table, Key: { pk: key.pk, sk: key.sk } }));
		}
	});
	const put = async (table: string, item: { pk: string; sk: string; [key: string]: unknown }) => {
		cleanup.push({ table, pk: item.pk, sk: item.sk });
		await db.send(new PutCommand({ TableName: table, Item: item }));
	};
	const createTestOrganisation = async (member: typeof owner, name: string) => {
		const orgId = await createOrganisation(member, name);
		cleanup.push(
			{ table: authTable, pk: `ORG#${orgId}`, sk: 'PROFILE' },
			{ table: authTable, pk: `ORG#${orgId}`, sk: `MEMBER#${member.id}` },
			{ table: authTable, pk: `USER#${member.id}`, sk: `ORG#${orgId}` }
		);
		return orgId;
	};
	const organisationId = await createTestOrganisation(owner, 'ONUS automated project test');
	await createTestOrganisation(outsider, 'ONUS automated isolation test');
	for (const [member, role] of [
		[otherOwner, 'OWNER'],
		[viewer, 'MEMBER']
	] as const) {
		await put(authTable, {
			pk: `USER#${member.id}`,
			sk: `ORG#${organisationId}`,
			organisationId,
			organisationName: 'ONUS automated project test',
			status: 'ACTIVE',
			role
		});
	}
	const project = await createProject(owner.id, input);
	const projectPk = `ORG#${organisationId}#PROJECT#${project.id}`;
	cleanup.push(
		{ table: projectsTable, pk: projectPk, sk: 'PROFILE' },
		{ table: projectsTable, pk: projectPk, sk: `MEMBER#${owner.id}` },
		{
			table: projectsTable,
			pk: `ORG#${organisationId}#USER#${owner.id}`,
			sk: `PROJECT#${project.id}`
		}
	);
	await t.test('creator is assigned and project survives reload', async () => {
		assert.equal((await getProject(owner.id, project.id)).canManage, true);
		assert.equal((await listProjects(owner.id))[0].name, 'Riverside development');
		assert.equal((await getProject(owner.id, project.id)).project.version, 1);
	});
	await t.test('organisation ownership and other tenants do not bypass membership', async () => {
		for (const member of [otherOwner, outsider, viewer]) {
			assert.deepEqual(await listProjects(member.id), []);
			await assert.rejects(getProject(member.id, project.id), expectError(404));
			await assert.rejects(updateProject(member.id, project.id, 1, input), expectError(404));
			await assert.rejects(setProjectArchived(member.id, project.id, 1, true), expectError(404));
		}
		await assert.rejects(createProject(viewer.id, input), expectError(403));
	});
	await put(projectsTable, {
		pk: projectPk,
		sk: `MEMBER#${viewer.id}`,
		status: 'ACTIVE',
		role: 'VIEWER'
	});
	await put(projectsTable, {
		pk: `ORG#${organisationId}#USER#${viewer.id}`,
		sk: `PROJECT#${project.id}`,
		projectId: project.id
	});
	await t.test('assigned readers can view but not edit or archive', async () => {
		assert.equal((await listProjects(viewer.id)).length, 1);
		assert.equal((await getProject(viewer.id, project.id)).canManage, false);
		await assert.rejects(updateProject(viewer.id, project.id, 1, input), expectError(403));
		await assert.rejects(setProjectArchived(viewer.id, project.id, 1, true), expectError(403));
	});
	await t.test('validation does not modify the record', async () => {
		await assert.rejects(
			updateProject(owner.id, project.id, 1, { ...input, status: 'INVALID' }),
			expectError(400)
		);
		assert.equal((await getProject(owner.id, project.id)).project.version, 1);
	});
	await t.test('concurrent saves permit one update, never a lost overwrite', async () => {
		const results = await Promise.allSettled([
			updateProject(owner.id, project.id, 1, {
				...input,
				name: 'Updated project A',
				status: 'ACTIVE'
			}),
			updateProject(owner.id, project.id, 1, {
				...input,
				name: 'Updated project B',
				status: 'ON_HOLD'
			})
		]);
		assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
		const failure = results.find((result) => result.status === 'rejected');
		assert.ok(failure?.status === 'rejected' && expectError(409)(failure.reason));
		assert.equal((await getProject(owner.id, project.id)).project.version, 2);
	});
	await t.test('archive retains details, blocks edits and can be restored', async () => {
		const archived = await setProjectArchived(owner.id, project.id, 2, true);
		assert.ok(archived.archivedAt);
		assert.equal((await listProjects(owner.id))[0].archivedAt, archived.archivedAt);
		await assert.rejects(updateProject(owner.id, project.id, 3, input), expectError(409));
		const restored = await setProjectArchived(owner.id, project.id, 3, false);
		assert.equal(restored.archivedAt, null);
		assert.equal(restored.version, 4);
		assert.equal(restored.createdAt, project.createdAt);
	});
	await t.test('revoked assignment hides a stale listing reference', async () => {
		await put(projectsTable, {
			pk: projectPk,
			sk: `MEMBER#${viewer.id}`,
			status: 'REVOKED',
			role: 'VIEWER'
		});
		assert.deepEqual(await listProjects(viewer.id), []);
		await assert.rejects(getProject(viewer.id, project.id), expectError(404));
	});
	await t.test('DynamoDB stores project metadata without TTL expiry', async () => {
		const result = await db.send(
			new GetCommand({
				TableName: projectsTable,
				Key: { pk: projectPk, sk: 'PROFILE' },
				ConsistentRead: true
			})
		);
		assert.equal(result.Item?.version, 4);
		assert.equal(result.Item?.organisationId, organisationId);
		assert.equal(result.Item?.ttl, undefined);
	});
	await t.test('listing follows pagination and ignores unassigned references', async () => {
		for (let index = 0; index < 51; index++) {
			const missingId = `00000000-0000-0000-0000-${String(index).padStart(12, '0')}`;
			await put(projectsTable, {
				pk: `ORG#${organisationId}#USER#${owner.id}`,
				sk: `PROJECT#${missingId}`,
				projectId: missingId
			});
		}
		const listed = await listProjects(owner.id);
		assert.equal(listed.length, 1);
		assert.equal(listed[0].id, project.id);
	});
});
