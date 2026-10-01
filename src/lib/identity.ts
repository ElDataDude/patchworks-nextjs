/** Patchworks ID, the single sign-on service for Patchworks apps. */
export const ID_URL = (
  process.env.NEXT_PUBLIC_ID_URL || "https://id.patchworks.ai"
).replace(/\/+$/, "");

/** The Business OS launcher, shown to signed-in visitors as "Your apps". */
export const YOUR_APPS_URL = "https://os.patchworks.ai";

export function signInUrl(returnTo: string): string {
  return `${ID_URL}/sign-in?return=${encodeURIComponent(returnTo)}`;
}
