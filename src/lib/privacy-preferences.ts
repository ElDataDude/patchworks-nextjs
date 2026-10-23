export const PRIVACY_COOKIE_NAME = "patchworks_privacy";
export const PRIVACY_COOKIE_VERSION = "v1";
export const PRIVACY_COOKIE_MAX_AGE = 60 * 60 * 24 * 183;
export const PRIVACY_PREFERENCE_EVENT = "patchworks:privacy-preference";
export const OPEN_PRIVACY_PREFERENCES_EVENT =
  "patchworks:open-privacy-preferences";

export type PrivacyPreference = "essential" | "booking";

export function readPrivacyPreference(): PrivacyPreference | null {
  if (typeof document === "undefined") return null;
  const prefix = `${PRIVACY_COOKIE_NAME}=${PRIVACY_COOKIE_VERSION}.`;
  const value = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length);
  return value === "essential" || value === "booking" ? value : null;
}

export function writePrivacyPreference(preference: PrivacyPreference) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${PRIVACY_COOKIE_NAME}=${PRIVACY_COOKIE_VERSION}.${preference}; Max-Age=${PRIVACY_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(
    new CustomEvent<PrivacyPreference>(PRIVACY_PREFERENCE_EVENT, {
      detail: preference,
    }),
  );
}

export function subscribePrivacyPreference(
  listener: (preference: PrivacyPreference) => void,
) {
  const handler = (event: Event) =>
    listener((event as CustomEvent<PrivacyPreference>).detail);
  window.addEventListener(PRIVACY_PREFERENCE_EVENT, handler);
  return () => window.removeEventListener(PRIVACY_PREFERENCE_EVENT, handler);
}
