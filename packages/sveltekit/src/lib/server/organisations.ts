import { randomUUID } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { Resource } from 'sst';
import type { OnusUser } from './auth';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const table = Resource.OnusAuthData.name;

export type OrganisationRole = 'OWNER' | 'ADMIN' | 'PROJECT_MANAGER' | 'MEMBER' | 'VIEWER';
export type OrganisationMembership = {
  organisationId: string;
  organisationName: string;
  role: OrganisationRole;
};
export async function membershipsFor(userId: string): Promise<OrganisationMembership[]> {
  const response = await db.send(new QueryCommand({
    TableName: table,
    KeyConditionExpression: 'pk = :user AND begins_with(sk, :prefix)',
    ExpressionAttributeValues: { ':user': 'USER#' + userId, ':prefix': 'ORG#' },
    ConsistentRead: true
  }));
  return (response.Items ?? []).filter((x) => x.status === 'ACTIVE').map((x) => ({
    organisationId: String(x.organisationId),
    organisationName: String(x.organisationName),
    role: x.role as OrganisationRole
  }));
}
export async function organisationForUser(userId: string) {
  const memberships = await membershipsFor(userId);
  const active = memberships[0];
  if (!active) return null;
  const record = await db.send(new GetCommand({
    TableName: table,
    Key: { pk: 'ORG#' + active.organisationId, sk: 'PROFILE' },
    ConsistentRead: true
  }));
  if (!record.Item || record.Item.status !== 'ACTIVE') return null;
  return active;
}
export async function createOrganisation(user: OnusUser, nameInput: string) {
  const name = nameInput.trim();
  if (name.length < 2 || name.length > 120) {
    throw new Error('Organisation name must be between 2 and 120 characters.');
  }
  // Only the original account owner may start a new workspace during onboarding.
  if ((await membershipsFor(user.id)).length) throw new Error('You already belong to an organisation.');
  const id = randomUUID();
  const now = new Date().toISOString();
  await db.send(new TransactWriteCommand({ TransactItems: [
    { Put: {
      TableName: table,
      Item: { pk: 'ORG#' + id, sk: 'PROFILE', id, name, status: 'ACTIVE', createdAt: now, createdBy: user.id },
      ConditionExpression: 'attribute_not_exists(pk)'
    } },
    { Put: {
      TableName: table,
      Item: { pk: 'USER#' + user.id, sk: 'ORG#' + id, organisationId: id, organisationName: name, role: 'OWNER', status: 'ACTIVE', createdAt: now },
      ConditionExpression: 'attribute_not_exists(pk)'
    } },
    { Put: {
      TableName: table,
      Item: { pk: 'ORG#' + id, sk: 'MEMBER#' + user.id, userId: user.id, role: 'OWNER', status: 'ACTIVE', createdAt: now },
      ConditionExpression: 'attribute_not_exists(pk)'
    } }
  ] }));
  return id;
}
