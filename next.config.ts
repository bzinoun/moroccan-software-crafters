import type { NextConfig } from "next";

// Empty locally, "/moroccan-software-crafters" on GitHub Pages (set in CI).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // cacheComponents and partialPrefetching imply PPR, which a static export refuses.
};

export default nextConfig;
