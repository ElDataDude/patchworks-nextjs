import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  contactUnavailableResponse,
  handleContactRequest,
} from "@/lib/contact-server";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  try {
    const { env } = getCloudflareContext();
    return await handleContactRequest(request, {
      env,
      development: process.env.NODE_ENV === "development",
    });
  } catch {
    console.error(JSON.stringify({ event: "contact_route_unavailable" }));
    return contactUnavailableResponse();
  }
}
