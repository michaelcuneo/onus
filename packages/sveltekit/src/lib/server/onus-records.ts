/** Canonical source references shared by native ONUS data and future read-only connectors. */
export type OnusSource = 'ONUS' | 'PROCORE' | 'ACONEX' | 'MICROSOFT_365' | 'PRIMAVERA_P6' | 'OTHER';
export type OnusRecordKind = 'RFI' | 'DOCUMENT' | 'EMAIL' | 'PROGRAMME_ACTIVITY' | 'APPROVAL' | 'TASK';
export type SourceReference = {
  system: OnusSource;
  externalId: string;
  url?: string;
  revision?: string;
  observedAt: string;
};
export type Assignment = {
  userId?: string;
  organisationId?: string;
  displayName: string;
  role: 'RESPONDER' | 'REVIEWER' | 'APPROVER' | 'OBSERVER';
};
export type ProgrammeLink = {
  activityId: string;
  externalReference?: SourceReference;
  relationship: 'AFFECTS' | 'BLOCKS' | 'REFERENCES';
};
export type CanonicalProjectRecord = {
  id: string;
  projectId: string;
  organisationId: string;
  kind: OnusRecordKind;
  title: string;
  status: string;
  assignments: Assignment[];
  programmeLinks: ProgrammeLink[];
  source: SourceReference;
  dueAt?: string;
  dependsOn?: string[];
  evidenceIds: string[];
};
export interface ReadOnlyProjectConnector {
  readonly system: OnusSource;
  listRecords(projectId: string, cursor?: string): Promise<{ records: CanonicalProjectRecord[]; cursor?: string }>;
}
/** A connector must never write to an external provider through this interface. */
export function validateImportedRecord(record: CanonicalProjectRecord, organisationId: string, projectId: string): CanonicalProjectRecord {
  if (record.organisationId !== organisationId || record.projectId !== projectId)
    throw new Error('Connector returned a record outside the authorised project.');
  if (!record.id || !record.source.externalId || !record.source.observedAt)
    throw new Error('Connector record is missing provenance.');
  return record;
}
