"use client";
import { ArrowUpRight } from "lucide-react";
import { appBySlug, appUrl, type AppSlug } from "@/data/apps";
import { useSessionApps } from "./SessionAppsProvider";

/**
 * Renders "Open <App>" only when the visitor's Patchworks ID session grants
 * the app. The launch URL is built from local catalogue data.
 */
export default function OpenAppSlot({
  app,
  launchPath,
}: {
  app: AppSlug;
  launchPath?: string;
}) {
  const session = useSessionApps();
  const entry = appBySlug(app);
  if (
    !entry ||
    !launchPath ||
    session.status !== "signed-in" ||
    !session.apps.includes(app)
  )
    return <span className="open-app-slot" data-open-app={app} hidden />;
  return (
    <span className="open-app-slot" data-open-app={app}>
      <a
        className="text-link catalogue-open-link"
        href={appUrl(app, launchPath)}
      >
        Open {entry.name}
        <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
      </a>
    </span>
  );
}
