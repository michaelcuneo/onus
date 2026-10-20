import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Resource } from 'sst';
import { getProject } from './projects.js';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const table = Resource.OnusWorkflowData.name;

export type WipRecord = {
  pk: string;
  sk: string;
  id?: string;
  kind?: string;
  status?: string;
  title?: string;
  dueAt?: string;
  source?: string;
  explanation?: string;
  dependsOn?: string;
  relatedWorkId?: string;
  evidence?: string[];
  dependencyIds?: string[];
  simulationStep?: number;
  updatedAt?: string;
  [key: string]: unknown;
};

/**
 * All access is scoped through the existing project membership check.
 * Never accept an organisation ID from the browser as authority.
 */
export async function dailyWipForProject(userId: string, projectId: string) {
  const { project, organisation, canManage } = await getProject(userId, projectId);
  const pk = `ORG#${organisation.organisationId}#PROJECT#${project.id}`;
  const records: WipRecord[] = [];
  let cursor: Record<string, unknown> | undefined;

  do {
    const response = await db.send(new QueryCommand({
      TableName: table,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': pk },
      ExclusiveStartKey: cursor,
      ConsistentRead: true
    }));
    records.push(...(response.Items ?? []) as WipRecord[]);
    cursor = response.LastEvaluatedKey;
  } while (cursor);

  return {
    project: { id: project.id, name: project.name },
    canManage: canManage && !project.archivedAt,
    workItems: records.filter((item) => item.sk.startsWith('WORK#')),
    proposedActions: records.filter((item) => item.sk.startsWith('ACTION#')),
    events: records.filter((item) => item.sk.startsWith('EVENT#'))
  };
}
