"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export function shouldLoadCloudflareAnalytics({
  nodeEnvironment,
  siteEnvironment,
  token,
  hostname,
}: {
  nodeEnvironment: string | undefined;
  siteEnvironment: string | undefined;
  token: string | undefined;
  hostname: string;
}) {
  return (
    nodeEnvironment === "production" &&
    siteEnvironment === "production" &&
    Boolean(token?.trim()) &&
    hostname === "patchworks.ai"
  );
}

export default function CloudflareWebAnalytics() {
  const token = process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN?.trim();
  const [hostname, setHostname] = useState("");

  useEffect(() => setHostname(window.location.hostname), []);

  if (
    !shouldLoadCloudflareAnalytics({
      nodeEnvironment: process.env.NODE_ENV,
      siteEnvironment: process.env.NEXT_PUBLIC_SITE_ENV,
      token,
      hostname,
    })
  )
    return null;

  return (
    <Script
      id="cloudflare-web-analytics"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      type="module"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
