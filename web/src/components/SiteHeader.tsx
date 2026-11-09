import Link from "next/link";
import type { Cta, PageId, Site } from "@/content/types";
import { frenchSpacing } from "@/lib/french";
import { assetUrl, pageRoute, toRoute } from "@/lib/routes";
import { NavToggle } from "./NavToggle";

type HeaderCta = Cta & { variant: "primary" | "ghost" };

// Per-page CTA rule from the design inventory (COMPONENTS.md, site header).
function headerCta(page: PageId, siteCta: Cta): HeaderCta {
  switch (page) {
    case "socrates":
      return { label: "Devenir partenaire", href: "#sponsoring", variant: "primary" };
    case "host":
      return { label: "Les formules", href: "index.html#offres", variant: "ghost" };
    default:
      return { ...siteCta, variant: "primary" };
  }
}

export function SiteHeader({ site, page }: { site: Site; page: PageId }) {
  const current = pageRoute(page);
  const cta = headerCta(page, site.cta);
  const ctaClass = `btn btn-${cta.variant}`;
  const ctaRoute = toRoute(cta.href);

  return (
    <header className="site-header">
      <div className="wrap">
        <Link className="brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element -- faithful port, images are unoptimized */}
          <img src={assetUrl("/assets/img/logo.png")} alt="" width={44} height={44} />
          <span>
            <strong>{frenchSpacing(site.name)}</strong>
            <small>{frenchSpacing(site.tagline)}</small>
          </span>
        </Link>
        <NavToggle>
          {site.nav.map((link) => {
            const active = !link.href.includes("#") && toRoute(link.href) === current;
            return (
              <Link
                key={link.href}
                href={toRoute(link.href)}
                aria-current={active ? "page" : undefined}
              >
                {frenchSpacing(link.label)}
              </Link>
            );
          })}
          <Link className={`${ctaClass} nav-cta`} href={ctaRoute}>
            {frenchSpacing(cta.label)}
          </Link>
        </NavToggle>
        <Link className={ctaClass} href={ctaRoute}>
          {frenchSpacing(cta.label)}
        </Link>
      </div>
    </header>
  );
}
