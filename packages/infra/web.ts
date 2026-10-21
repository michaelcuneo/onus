import { authData, authPepper, mailFrom } from "./auth";
import { projectsData } from "./projects";

export const website = new sst.aws.SvelteKit("OnusWebsite", {
  path: "packages/sveltekit",
  domain: $app.stage === "production" ? "onus.michaelcuneo.com.au" : undefined,
  server: { runtime: "nodejs24.x" },
  link: [authData, authPepper, mailFrom, projectsData],
  permissions: [{ actions: ["ses:SendEmail"], resources: ["*"] }],
});
