// ONUS Daily WIP proof of concept: tenant-scoped workflow state.
// The pk/sk access patterns and GSIs are provisional until the API queries are finalised.
// Keep authentication records in OnusAuthData and project records in OnusProjectsData.
export const workflowData = new sst.aws.Dynamo("OnusWorkflowData", {
  fields: {
    pk: "string",
    sk: "string",
    gsi1pk: "string",
    gsi1sk: "string",
  },
  primaryIndex: { hashKey: "pk", rangeKey: "sk" },
  globalIndexes: {
    gsi1: { hashKey: "gsi1pk", rangeKey: "gsi1sk" },
  },
});

// Suggested keys (not yet implemented by application code):
// pk = ORG#<orgId>#PROJECT#<projectId>, sk = WORK#<kind>#<id>
// pk = ORG#<orgId>#PROJECT#<projectId>, sk = EVENT#<isoTime>#<eventId>
// pk = ORG#<orgId>#PROJECT#<projectId>, sk = ACTION#<id>
// gsi1pk = ORG#<orgId>#ASSIGNEE#<userId>, gsi1sk = DUE#<isoTime>#<id>
// All queries and mutations must verify authenticated organisation/project membership.
