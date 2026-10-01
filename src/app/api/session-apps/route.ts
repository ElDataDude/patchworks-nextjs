import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  handleSessionAppsRequest,
  sessionAppsResponse,
  type SessionAppsEnv,
} from "@/lib/session-apps-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    const { env } = getCloudflareContext();
    return await handleSessionAppsRequest(request, {
      env: env as unknown as SessionAppsEnv,
    });
  } catch {
    console.error(JSON.stringify({ event: "session_apps_route_unavailable" }));
    return sessionAppsResponse({ status: "unavailable", apps: [] });
  }
}
