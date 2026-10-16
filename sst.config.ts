/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "onus",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const { website } = await import("./packages/infra/web");
    const { authData } = await import("./packages/infra/auth");

    return {
      website: website.url,
      authTable: authData.name,
    };
  },
});
