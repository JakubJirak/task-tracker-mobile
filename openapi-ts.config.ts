import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./api.json",
  output: {
    path: "./src/client",
    postProcess: ["prettier"],
  },
  plugins: [
    { name: "@tanstack/react-query", queryOptions: true },
    "@hey-api/sdk",
    "@hey-api/schemas",
    "@hey-api/client-axios",
  ],
});
