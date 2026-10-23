import type { PatchworksApp } from "@/data/apps";

const STATUS_LABEL = { live: "Live", planned: "In development" } as const;
const ACCESS_LABEL = {
  staff: "Patchworks staff",
  invite: "By invitation",
  customer: "Customer teams",
} as const;

export default function AppBadge({ app }: { app: PatchworksApp }) {
  return (
    <span className="app-badge" data-app={app.slug} data-status={app.status}>
      <span className="app-badge-name">{app.name}</span>
      <span className="app-badge-meta">
        <span className="app-badge-status">{STATUS_LABEL[app.status]}</span>
        <span aria-hidden="true"> · </span>
        <span>{ACCESS_LABEL[app.access]}</span>
      </span>
    </span>
  );
}
