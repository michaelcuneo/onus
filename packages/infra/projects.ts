export const projectsData = new sst.aws.Dynamo("OnusProjectsData", {
  fields: { pk: "string", sk: "string" },
  primaryIndex: { hashKey: "pk", rangeKey: "sk" },
});
