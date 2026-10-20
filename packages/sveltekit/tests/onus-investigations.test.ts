import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { investigateRfis } from '../src/lib/server/onus-investigations.ts';
import type { WipRecord } from '../src/lib/server/daily-wip.ts';
const pk = 'ORG#test#PROJECT#test';
const records: WipRecord[] = [
  { pk, sk: 'WORK#RFI#1', id: '1', kind: 'RFI', title: 'Structural detail', status: 'OVERDUE',
    assignments: [{ displayName: 'Structural engineer', role: 'RESPONDER' }],
    programmeLinks: [{ activityId: 'P6-101', relationship: 'BLOCKS' }] },
  { pk, sk: 'WORK#APPROVAL#2', id: '2', kind: 'APPROVAL', title: 'Drawing approval', status: 'PENDING', dependsOn: '1' },
  { pk, sk: 'WORK#TASK#3', id: '3', kind: 'TASK', title: 'Installation', status: 'BLOCKED', dependsOn: '2' }
];
test('investigation traces assignee, programme link and transitive dependencies without claiming delay', () => {
  const [result] = investigateRfis(records);
  assert.deepEqual(result.responsibleParties, ['Structural engineer']);
  assert.deepEqual(result.programmeActivities, ['P6-101']);
  assert.deepEqual(result.downstream.map((d) => d.id), ['2', '3']);
  assert.equal(result.impactAssessment, 'NOT_ESTABLISHED');
});
test('answered RFI retains blocked work and requests drawing review', () => {
  const updated = records.map((r) => r.id === '1' ? { ...r, status: 'ANSWERED' } : r.id === '2' ? { ...r, status: 'READY_FOR_REVIEW' } : r);
  const [result] = investigateRfis(updated);
  assert.match(result.nextAction, /Drawing approval/);
  assert.equal(result.downstream.find((d) => d.id === '3')?.status, 'BLOCKED');
});
