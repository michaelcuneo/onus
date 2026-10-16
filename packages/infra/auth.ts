// First-party authentication data. No Cognito or hosted identity provider.
export const authData = new sst.aws.Dynamo("OnusAuthData", {
  fields: { pk: "string", sk: "string" },
  primaryIndex: { hashKey: "pk", rangeKey: "sk" },
  ttl: "ttl",
});

export const authPepper = new sst.Secret("OnusAuthPepper");
export const mailFrom = new sst.Secret("OnusMailFrom");
