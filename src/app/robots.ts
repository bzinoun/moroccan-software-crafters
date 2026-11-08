import type { MetadataRoute } from "next";
import { loadSite } from "@/content/load";

// A static export needs the metadata route prerendered at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const { baseUrl } = loadSite();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
