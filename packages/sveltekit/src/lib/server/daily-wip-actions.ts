import { randomUUID } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, BatchWriteCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { Resource } from 'sst';
import { ProjectError } from '../projects.js';
import { getProject } from './projects.js';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const table = Resource.OnusWorkflowData.name;

async function managerContext(userId: string, projectId: string) {
  const { project, organisation, canManage } = await getProject(userId, projectId);
  if (!canManage) throw new ProjectError(403, 'Project manager access is required.');
  if (project.archivedAt) throw new ProjectError(409, 'Restore this project before changing its workflow.');
  return { pk: `ORG#${organisation.organisationId}#PROJECT#${project.id}`, userId };
}

export async function seedDailyWipDemo(userId: string, projectId: string) {
  const { pk } = await managerContext(userId, projectId);
  const now = new Date().toISOString();
  const dueAt = new Date(Date.now() - 2 * 86400000).toISOString();
  const records = [
    { sk: 'WORK#RFI#demo-rfi', id: 'demo-rfi', kind: 'RFI', title: 'RFI-001: Confirm structural penetration', status: 'OVERDUE', dueAt, source: 'DEMO:external-rfi', responsibleParty: 'Structural design reviewer' },
    { sk: 'WORK#APPROVAL#demo-document', id: 'demo-document', kind: 'APPROVAL', title: 'Drawing revision awaiting approval', status: 'PENDING', dependsOn: 'demo-rfi', source: 'DEMO:document-control' },
    { sk: 'WORK#TASK#demo-activity', id: 'demo-activity', kind: 'TASK', title: 'Level 2 installation blocked', status: 'BLOCKED', dependsOn: 'demo-document', source: 'DEMO:programme' }
  ];
  // Stable keys and conditional writes prevent repeat demo loads from overwriting decisions.
  for (const record of records) {
    try {
      await db.send(new PutCommand({
        TableName: table,
        Item: { pk, ...record, createdAt: now, updatedAt: now },
        ConditionExpression: 'attribute_not_exists(pk)'
      }));
    } catch (cause) {
      if (!(cause instanceof Error && cause.name === 'ConditionalCheckFailedException')) throw cause;
    }
  }
}

export async function approveDailyWipAction(userId: string, projectId: string, actionId: string) {
  if (!/^followup-[a-zA-Z0-9_-]{1,100}$/.test(actionId) && actionId !== 'demo-followup') throw new ProjectError(400, 'Unknown proposed action.');
  const { pk } = await managerContext(userId, projectId);
  const now = new Date().toISOString();
  const eventId = randomUUID();
  try {
    await db.send(new TransactWriteCommand({ TransactItems: [
      { Update: {
        TableName: table,
        Key: { pk, sk: `ACTION#${actionId}` },
        UpdateExpression: 'SET #status = :approved, approvedBy = :user, approvedAt = :now, updatedAt = :now',
        ConditionExpression: '#status = :proposed',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':approved': 'APPROVED', ':proposed': 'PROPOSED', ':user': userId, ':now': now }
      } },
      { Put: {
        TableName: table,
        Item: { pk, sk: `EVENT#${now}#${eventId}`, id: eventId, kind: 'AUDIT', title: 'Follow-up approved; external notification not yet sent', status: 'APPROVED', actionId, actorId: userId, createdAt: now, source: 'ONUS' },
        ConditionExpression: 'attribute_not_exists(pk)'
      } }
    ] }));
  } catch (cause) {
    if (cause instanceof Error && cause.name === 'TransactionCanceledException')
      throw new ProjectError(409, 'This action has already changed. Refresh to see its current status.');
    throw cause;
  }
}

/** Reset only known POC records; never clear a project's other workflow data. */
export async function resetDailyWipDemo(userId: string, projectId: string) {
  const { pk } = await managerContext(userId, projectId);
  const records: Array<Record<string, unknown>> = [];
  let cursor: Record<string, unknown> | undefined;
  do {
    const page = await db.send(new QueryCommand({
      TableName: table,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': pk },
      ExclusiveStartKey: cursor,
      ConsistentRead: true
    }));
    records.push(...(page.Items ?? []));
    cursor = page.LastEvaluatedKey;
  } while (cursor);

  const demoKeys = new Set([
    'WORK#RFI#demo-rfi',
    'WORK#APPROVAL#demo-document',
    'WORK#TASK#demo-activity',
    'ACTION#demo-followup',
    'ACTION#followup-demo-rfi',
    'EVENT#demo-detection',
    'EVENT#ASSESSMENT#followup-demo-rfi',
    'EVENT#SIMULATED#followup-demo-rfi#1',
    'EVENT#SIMULATED#followup-demo-rfi#2',
    'EVENT#SIMULATED#followup-demo-rfi#3',
    'EVENT#SIMULATED#followup-demo-rfi#4',
    'EVENT#RESOLUTION#demo-rfi'
  ]);
  const deletable = records.filter((record) => {
    const sk = record.sk;
    if (typeof sk !== 'string') return false;
    if (demoKeys.has(sk)) return true;
    return sk.startsWith('EVENT#') &&
      (record.actionId === 'demo-followup' || record.actionId === 'followup-demo-rfi' || record.relatedWorkId === 'demo-rfi') &&
      (record.kind === 'AUDIT' || record.kind === 'RESOLUTION' || record.kind === 'DEPENDENCY_REEVALUATION');
  });
  let pending = deletable.map((record) => ({
    DeleteRequest: { Key: { pk, sk: record.sk as string } }
  }));
  let deleted = 0;
  while (pending.length) {
    const batch = pending.slice(0, 25);
    const result = await db.send(new BatchWriteCommand({
      RequestItems: { [table]: batch }
    }));
    const unprocessed = result.UnprocessedItems?.[table] ?? [];
    deleted += batch.length - unprocessed.length;
    pending = [...unprocessed.filter((item): item is { DeleteRequest: { Key: { pk: string; sk: string } } } => typeof item.DeleteRequest?.Key?.pk === 'string' && typeof item.DeleteRequest.Key.sk === 'string'), ...pending.slice(25)];
    if (unprocessed.length) await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return { deleted };
}

/**
 * Demonstration-only execution. No network requests, email or external writes.
 * A repeatable cycle simulates first reminder, second reminder, escalation,
 * then a recorded response. Every step is a conditional DynamoDB transaction.
 */
export async function advanceDemoFollowup(userId: string, projectId: string) {
  const { pk } = await managerContext(userId, projectId);
  const actionId = 'followup-demo-rfi';
  const sk = `ACTION#${actionId}`;
  const { GetCommand } = await import('@aws-sdk/lib-dynamodb');
  const current = await db.send(new GetCommand({ TableName: table, Key: { pk, sk }, ConsistentRead: true }));
  const action = current.Item;
  if (!action || action.source !== 'ONUS:rules' || action.relatedWorkId !== 'demo-rfi') {
    throw new ProjectError(404, 'Load the demo before running its follow-up.');
  }
  const step = typeof action.simulationStep === 'number' ? action.simulationStep : 0;
  if (step >= 4) throw new ProjectError(409, 'Demonstration is complete. Reset the demo to replay it.');
  if (step > 0 && action.status === 'SIMULATED_RESPONDED') throw new ProjectError(409, 'This RFI is already answered.');
  const next = step + 1;
  const statuses = ['SIMULATED_SENT', 'SIMULATED_REMINDER', 'SIMULATED_ESCALATED', 'SIMULATED_RESPONDED'] as const;
  const titles = [
    'Simulated: first RFI reminder prepared for structural design reviewer',
    'Simulated: second reminder after 24 hours without a response',
    'Simulated: escalation to project manager after 72 hours',
    'Simulated: structural design reviewer response received'
  ];
  const now = new Date().toISOString();
  const status = statuses[step];
  const resolutionWrites = next === 4 ? [
    { Update: {
      TableName: table, Key: { pk, sk: 'WORK#RFI#demo-rfi' },
      UpdateExpression: 'SET #status = :answered, answeredAt = :now, responseSummary = :response, updatedAt = :now',
      ConditionExpression: '#status = :overdue',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':answered': 'ANSWERED', ':overdue': 'OVERDUE', ':now': now, ':response': 'DEMO: Structural reviewer confirmed penetration detail; drawing revision still requires approval.' }
    } },
    { Update: {
      TableName: table, Key: { pk, sk: 'WORK#APPROVAL#demo-document' },
      UpdateExpression: 'SET #status = :ready, updatedAt = :now',
      ConditionExpression: '#status = :pending AND dependsOn = :rfi',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':ready': 'READY_FOR_REVIEW', ':pending': 'PENDING', ':rfi': 'demo-rfi', ':now': now }
    } },
    { Put: {
      TableName: table,
      Item: { pk, sk: 'EVENT#RESOLUTION#demo-rfi', id: 'resolution-demo-rfi', kind: 'RESOLUTION', title: 'RFI answered; follow-ups stopped. Drawing approval ready for review; installation remains blocked.', actionId, relatedWorkId: 'demo-rfi', status: 'ANSWERED', source: 'DEMO:simulation', createdAt: now },
      ConditionExpression: 'attribute_not_exists(pk)'
    } }
  ] : [];
  try {
    await db.send(new TransactWriteCommand({ TransactItems: [
      { Update: {
        TableName: table, Key: { pk, sk },
        UpdateExpression: 'SET #status = :status, simulationStep = :next, updatedAt = :now',
        ConditionExpression: 'attribute_exists(pk) AND #status = :previous AND (attribute_not_exists(simulationStep) OR simulationStep = :step)',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status': status, ':previous': step === 0 ? 'PROPOSED' : statuses[step - 1], ':step': step, ':next': next, ':now': now }
      } },
      { Put: {
        TableName: table,
        Item: { pk, sk: `EVENT#SIMULATED#${actionId}#${next}`, id: `simulated-${next}`, kind: 'SIMULATED_FOLLOWUP', title: titles[step], status, actionId, source: 'DEMO:simulation', createdAt: now, simulationStep: next },
        ConditionExpression: 'attribute_not_exists(pk)'
      } },
      ...resolutionWrites
    ] }));
  } catch (cause) {
    if (cause instanceof Error && cause.name === 'TransactionCanceledException')
      throw new ProjectError(409, 'Demo state changed or the RFI was already resolved. Refresh and try again.');
    throw cause;
  }
  return { step: next, status, description: titles[step] };
}
