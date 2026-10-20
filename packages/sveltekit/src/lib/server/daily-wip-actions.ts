import { randomUUID } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
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
    { sk: 'WORK#RFI#demo-rfi', id: 'demo-rfi', kind: 'RFI', title: 'RFI-001: Confirm structural penetration', status: 'OVERDUE', dueAt, source: 'DEMO:external-rfi' },
    { sk: 'WORK#APPROVAL#demo-document', id: 'demo-document', kind: 'APPROVAL', title: 'Drawing revision awaiting approval', status: 'PENDING', dependsOn: 'demo-rfi', source: 'DEMO:document-control' },
    { sk: 'WORK#TASK#demo-activity', id: 'demo-activity', kind: 'TASK', title: 'Level 2 installation blocked', status: 'BLOCKED', dependsOn: 'demo-document', source: 'DEMO:programme' },
    { sk: 'ACTION#demo-followup', id: 'demo-followup', kind: 'FOLLOW_UP', title: 'Request RFI response from assigned reviewer', status: 'PROPOSED', relatedWorkId: 'demo-rfi', source: 'DEMO:recommendation' },
    { sk: 'EVENT#demo-detection', id: 'demo-detection', kind: 'DETECTION', title: 'Overdue RFI linked to pending approval and blocked activity', status: 'DETECTED', source: 'DEMO:rule-engine' }
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
  if (actionId !== 'demo-followup') throw new ProjectError(400, 'Unknown proposed action.');
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
