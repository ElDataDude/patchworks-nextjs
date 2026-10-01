import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const target = process.argv[2] ?? "preview";
if (!["preview", "production"].includes(target))
  throw new Error("Use preview or production");
const config = JSON.parse(
  readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8"),
);
const vars = target === "production" ? config.env.production.vars : config.vars;
const args = ["node_modules/@opennextjs/cloudflare/dist/cli/index.js", "build"];
if (target === "production") args.push("--env", "production");
const result = spawnSync(process.execPath, args, {
  cwd: new URL("..", import.meta.url),
  stdio: "inherit",
  env: {
    ...process.env,
    ...vars,
    // Preview is a Cloudflare deployment environment, not a Next.js dev build.
    // Next's compiled route module chooses its dev/prod runtime from NODE_ENV.
    NODE_ENV: "production",
    NEXTJS_ENV: "production",
    WRANGLER_SEND_METRICS: "false",
    WRANGLER_WRITE_LOGS: "false",
  },
});
process.exit(result.status ?? 1);
