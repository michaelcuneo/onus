import { authData, authPepper, mailFrom } from "./auth";
import { projectsData } from "./projects";
import { workflowData } from "./workflow";

export const website = new sst.aws.SvelteKit("OnusWebsite", {
  path: "packages/sveltekit",
  link: [authData, authPepper, mailFrom, projectsData, workflowData],
  permissions: [{ actions: ["ses:SendEmail"], resources: ["*"] }],
});
