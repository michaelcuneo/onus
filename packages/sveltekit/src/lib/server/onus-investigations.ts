import type { WipRecord } from './daily-wip.js';
import type { Assignment, ProgrammeLink } from './onus-records.js';

export type Investigation = {
  rfiId: string;
  title: string;
  status: string;
  responsibleParties: string[];
  programmeActivities: string[];
  downstream: { id: string; title: string; status: string }[];
  evidenceKeys: string[];
  finding: string;
  nextAction: string;
  impactAssessment: 'NOT_ESTABLISHED';
};

/** Pure, deterministic assessment. Never infer contractual delay from a programme link. */
export function investigateRfis(workItems: WipRecord[], events: WipRecord[] = []): Investigation[] {
  const byId = new Map(workItems.filter((item) => typeof item.id === 'string').map((item) => [item.id as string, item]));
  return workItems.filter((item) => item.kind === 'RFI' && typeof item.id === 'string').map((rfi) => {
    const assignments = Array.isArray(rfi.assignments) ? rfi.assignments as Assignment[] : [];
    const links = Array.isArray(rfi.programmeLinks) ? rfi.programmeLinks as ProgrammeLink[] : [];
    const responsibleParties = assignments.filter((a) => a.role === 'RESPONDER').map((a) => a.displayName).filter(Boolean);
    if (!responsibleParties.length && typeof rfi.responsibleParty === 'string') responsibleParties.push(rfi.responsibleParty);
    const downstream = workItems.filter((record) => {
      const visited = new Set<string>();
      let parent = record.dependsOn;
      while (typeof parent === 'string' && !visited.has(parent)) {
        if (parent === rfi.id) return true;
        visited.add(parent);
        parent = byId.get(parent)?.dependsOn;
      }
      return false;
    }).map((record) => ({ id: record.id ?? record.sk, title: record.title ?? record.sk, status: record.status ?? 'UNKNOWN' }));
    const evidenceKeys = [rfi.sk, ...workItems.filter((item) => downstream.some((d) => d.id === (item.id ?? item.sk))).map((item) => item.sk),
      ...events.filter((event) => event.relatedWorkId === rfi.id || event.actionId === `followup-${rfi.id}`).map((event) => event.sk)];
    const answered = rfi.status === 'ANSWERED';
    const next = downstream.find((item) => item.status === 'READY_FOR_REVIEW') ?? downstream.find((item) => item.status === 'PENDING' || item.status === 'BLOCKED');
    return {
      rfiId: rfi.id!, title: rfi.title ?? rfi.id!, status: rfi.status ?? 'UNKNOWN',
      responsibleParties, programmeActivities: [...new Set(links.map((link) => link.activityId).filter(Boolean))],
      downstream, evidenceKeys,
      finding: answered
        ? 'Response recorded. The RFI no longer requires chasing; linked approvals and construction constraints must be checked separately.'
        : 'Response outstanding. Linked activities and dependent records indicate potential exposure, not a verified programme delay.',
      nextAction: answered
        ? (next ? `Review ${next.title} (${next.status}); do not release blocked work without its own approval.` : 'Review linked programme activities for remaining constraints.')
        : `Request a response from ${responsibleParties.join(', ') || 'the assigned responder'} and verify any claimed programme impact.`,
      impactAssessment: 'NOT_ESTABLISHED' as const
    };
  });
}
