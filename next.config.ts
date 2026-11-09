import type { NextConfig } from "next";
import { parseBasePath } from "./src/lib/base-path";

// Hosted on Vercel at the domain root: the base path stays empty unless a
// build sets NEXT_PUBLIC_BASE_PATH. The pages are prerendered; only the
// saveLead Server Action runs on the server.
const basePath = parseBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

const nextConfig: NextConfig = {
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
