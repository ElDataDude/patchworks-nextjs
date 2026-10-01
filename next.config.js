const idUrl = (
  process.env.NEXT_PUBLIC_ID_URL || "https://id.patchworks.ai"
).replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },
  async redirects() {
    // Accounts live in Patchworks ID. Temporary (307) so the destination can
    // change without browsers caching it.
    return ["/signin", "/signup"].map((source) => ({
      source,
      destination: `${idUrl}/sign-in`,
      permanent: false,
    }));
  },
};

module.exports = nextConfig;
