"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { isAppSlug, type AppSlug } from "@/data/apps";

export type SessionAppsStatus =
  | "loading"
  | "signed-in"
  | "signed-out"
  | "unavailable";

export interface SessionApps {
  status: SessionAppsStatus;
  apps: readonly AppSlug[];
}

const INITIAL: SessionApps = { status: "loading", apps: [] };
const SessionAppsContext = createContext<SessionApps>(INITIAL);

/**
 * Asks the site's own `/api/session-apps` once per page load which Patchworks
 * apps the visitor may open. Server-rendered HTML never depends on the answer:
 * until it arrives (or if it fails) the page shows its static calls to action.
 */
export default function SessionAppsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<SessionApps>(INITIAL);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/session-apps", {
      credentials: "same-origin",
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((body: unknown) => {
        const value =
          body && typeof body === "object"
            ? (body as Record<string, unknown>)
            : {};
        const status =
          value.status === "signed-in" || value.status === "signed-out"
            ? value.status
            : "unavailable";
        const apps = Array.isArray(value.apps)
          ? value.apps.filter(isAppSlug)
          : [];
        setState({ status, apps: status === "signed-in" ? apps : [] });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setState({ status: "unavailable", apps: [] });
      });
    return () => controller.abort();
  }, []);
  return (
    <SessionAppsContext.Provider value={state}>
      {children}
    </SessionAppsContext.Provider>
  );
}

export function useSessionApps(): SessionApps {
  return useContext(SessionAppsContext);
}
