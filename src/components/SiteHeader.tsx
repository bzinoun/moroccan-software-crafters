import Link from "next/link";
import type { Cta, PageId, Site } from "@/content/types";
import { frenchSpacing } from "@/lib/french";
import { pageRoute } from "@/lib/routes";
import { Brand } from "./Brand";
import { Button } from "./Button";
import { Container } from "./Container";
import { NavToggle } from "./NavToggle";

type HeaderCta = Cta & { variant: "primary" | "ghost" };

// Per-page CTA rule from the design inventory (COMPONENTS.md, site header).
function headerCta(page: PageId | undefined, siteCta: Cta): HeaderCta {
  switch (page) {
    case "socrates":
      return {
        label: "Devenir partenaire",
        href: "#sponsoring",
        variant: "primary",
      };
    case "host":
      return {
        label: "Les formules",
        href: "/#offres",
        variant: "ghost",
      };
    default:
      return { ...siteCta, variant: "primary" };
  }
}

const linkClass =
  "border-b border-line py-3 text-s95 font-medium text-ink-soft no-underline hover:text-red aria-[current=page]:text-red lg:border-b-2 lg:border-transparent lg:py-1 lg:aria-[current=page]:border-red lg:aria-[current=page]:text-ink";

export function SiteHeader({ site, page }: { site: Site; page?: PageId }) {
  const current = page === undefined ? undefined : pageRoute(page);
  const cta = headerCta(page, site.cta);
  const links = site.nav.map((link) => {
    const active = !link.href.includes("#") && link.href === current;
    return (
      <Link
        key={link.href}
        href={link.href}
        aria-current={active ? "page" : undefined}
        className={linkClass}
      >
        {frenchSpacing(link.label)}
      </Link>
    );
  });

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-[10px] backdrop-saturate-[1.4]">
      <Container className="flex h-18 items-center gap-6">
        <Brand site={site} />
        {/* Below lg: the menu, a native disclosure. From lg up: the row of links. */}
        <NavToggle>
          {links}
          {/* The panel copy of the header button: full width at the bottom of the open menu. */}
          <Button className="mt-4" variant={cta.variant} href={cta.href}>
            {frenchSpacing(cta.label)}
          </Button>
        </NavToggle>
        <nav
          className="flex gap-[1.4rem] max-lg:hidden lg:ml-auto"
          aria-label="Navigation principale"
        >
          {links}
        </nav>
        <Button
          className="max-lg:hidden"
          variant={cta.variant}
          size="sm"
          href={cta.href}
        >
          {frenchSpacing(cta.label)}
        </Button>
      </Container>
    </header>
  );
}
