import { authData, authPepper, mailFrom } from "./auth";

export const website = new sst.aws.SvelteKit("OnusWebsite", {
  path: "packages/sveltekit",
  link: [authData, authPepper, mailFrom],
  permissions: [{ actions: ["ses:SendEmail"], resources: ["*"] }],
});
