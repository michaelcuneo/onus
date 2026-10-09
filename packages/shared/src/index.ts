/** Framework-neutral ONUS RFI identifiers and initial shared shapes.
 * These types do not authorise requests or validate persisted data.
 */
export type OrganisationId = string;
export type ProjectId = string;
export type UserId = string;
export type RfiId = string;

/** Dates in API payloads are UTC ISO-8601 timestamp strings. */
export type IsoTimestamp = string;

export interface OrganisationRef {
  id: OrganisationId;
  name: string;
}

export interface ProjectRef {
  id: ProjectId;
  organisationId: OrganisationId;
  name: string;
}
