import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  {
    // New in eslint-config-next 16 (React Compiler rules). Six existing
    // components set state in effects; warn until they are refactored.
    rules: { "react-hooks/set-state-in-effect": "warn" },
  },
  globalIgnores([
    ".next/**",
    ".open-next/**",
    ".wrangler/**",
    "output/**",
    "tmp/**",
    "next-env.d.ts",
    "cloudflare-env.d.ts",
  ]),
]);
