import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { Resource } from 'sst';
import { dailyWipForProject, type WipRecord } from './daily-wip.js';
import { getProject } from './projects.js';
import { ProjectError } from '../projects.js';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const table = Resource.OnusWorkflowData.name;

export type WipFinding = {
  actionId: string;
  title: string;
  relatedWorkId: string;
  explanation: string;
  evidence: string[];
  dependencyIds: string[];
};

export function assessWip(workItems: WipRecord[], now = new Date()): WipFinding[] {
  const byId = new Map(workItems.filter((item) => typeof item.id === 'string').map((item) => [item.id as string, item]));
  const findings: WipFinding[] = [];
  for (const item of workItems) {
    if (item.kind !== 'RFI' || !item.id || !item.dueAt || !['OPEN', 'PENDING', 'OVERDUE'].includes(item.status ?? '')) continue;
    const deadline = Date.parse(item.dueAt);
    if (!Number.isFinite(deadline) || deadline >= now.getTime()) continue;
    const dependents = workItems.filter((record) => {
      const visited = new Set<string>();
      let current: WipRecord | undefined = record;
      while (current && typeof current.dependsOn === 'string' && !visited.has(current.dependsOn)) {
        if (current.dependsOn === item.id) return true;
        visited.add(current.dependsOn);
        current = byId.get(current.dependsOn);
      }
      return false;
    });
    const days = Math.max(1, Math.ceil((now.getTime() - deadline) / 86400000));
    findings.push({
      actionId: `followup-${item.id}`,
      title: `Follow up overdue RFI: ${item.title ?? item.id}`,
      relatedWorkId: item.id,
      explanation: `Response is ${days} day(s) overdue. ${dependents.length} downstream record(s) depend on it. This is a potential programme risk, not a verified delay.`,
      evidence: [item.sk, ...dependents.map((record) => record.sk)],
      dependencyIds: dependents.flatMap((record) => typeof record.id === 'string' ? [record.id] : [])
    });
  }
  return findings;
}

/**
 * Explicit manual evaluation for the POC. Can later be invoked by an EventBridge
 * worker using a service-authorised project context instead of a user session.
 */
export async function evaluateProjectWip(userId: string, projectId: string) {
  const { project, organisation, canManage } = await getProject(userId, projectId);
  if (!canManage) throw new ProjectError(403, 'Project manager access is required.');
  if (project.archivedAt) throw new ProjectError(409, 'Archived projects cannot be evaluated.');
  const wip = await dailyWipForProject(userId, projectId);
  const findings = assessWip(wip.workItems);
  const pk = `ORG#${organisation.organisationId}#PROJECT#${project.id}`;
  let created = 0;
  for (const finding of findings) {
    const now = new Date().toISOString();
    try {
      await db.send(new TransactWriteCommand({ TransactItems: [
        { Put: {
          TableName: table,
          Item: { pk, sk: `ACTION#${finding.actionId}`, id: finding.actionId, kind: 'FOLLOW_UP', title: finding.title, status: 'PROPOSED', relatedWorkId: finding.relatedWorkId, explanation: finding.explanation, evidence: finding.evidence, dependencyIds: finding.dependencyIds, source: 'ONUS:rules', createdAt: now, updatedAt: now },
          ConditionExpression: 'attribute_not_exists(pk)'
        } },
        { Put: {
          TableName: table,
          Item: { pk, sk: `EVENT#ASSESSMENT#${finding.actionId}`, id: `assessment-${finding.actionId}`, kind: 'DETECTION', title: finding.explanation, actionId: finding.actionId, evidence: finding.evidence, status: 'DETECTED', source: 'ONUS:rules', createdAt: now },
          ConditionExpression: 'attribute_not_exists(pk)'
        } }
      ] }));
      created++;
    } catch (cause) {
      // A prior decision must never be reset to PROPOSED by re-evaluation.
      if (!(cause instanceof Error && cause.name === 'TransactionCanceledException')) throw cause;
    }
  }
  return { detected: findings.length, created };
}
