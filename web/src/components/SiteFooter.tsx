import Link from "next/link";
import type { Site } from "@/content/types";
import { frenchSpacing } from "@/lib/french";
import { assetUrl, isExternal, toRoute } from "@/lib/routes";

export function SiteFooter({ site }: { site: Site }) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <Link className="brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element -- faithful port, images are unoptimized */}
          <img src={assetUrl("/assets/img/logo.png")} alt="" width={52} height={52} />
          <span>
            <strong>{frenchSpacing(site.name)}</strong>
            <small>{frenchSpacing(site.mission)}</small>
          </span>
        </Link>
        <nav aria-label="Liens de pied de page" id="footer-nav">
          {site.footer.links.map((link) =>
            isExternal(link.href) ? (
              <a key={link.href} href={link.href} target="_blank" rel="noopener">
                {frenchSpacing(link.label)}
              </a>
            ) : (
              <Link key={link.href} href={toRoute(link.href)}>
                {frenchSpacing(link.label)}
              </Link>
            ),
          )}
        </nav>
        <p className="legal">{frenchSpacing(site.footer.legal)}</p>
      </div>
    </footer>
  );
}
