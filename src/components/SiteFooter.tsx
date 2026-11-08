import type { Site } from "@/content/types";
import { frenchSpacing } from "@/lib/french";
import { Brand } from "./Brand";
import { Container } from "./Container";
import { PageLink } from "./PageLink";

const linkClass =
  "text-cream no-underline hover:text-white hover:underline hover:underline-offset-3";

export function SiteFooter({ site }: { site: Site }) {
  return (
    // The sage focus indicator replaces the global green one on this dark surface.
    <footer className="bg-green-deep pt-14 pb-10 text-s92 text-on-dark **:focus-visible:outline-sage">
      <Container className="flex flex-wrap items-start justify-between gap-8">
        <Brand site={site} line={site.mission} size="lg" tone="dark" />
        <nav
          className="flex flex-wrap gap-5"
          aria-label="Liens de pied de page"
          id="footer-nav"
        >
          {site.footer.links.map((link) => (
            <PageLink key={link.href} className={linkClass} href={link.href}>
              {frenchSpacing(link.label)}
            </PageLink>
          ))}
        </nav>
        <p className="w-full border-t border-white/16 pt-5 text-s84 text-on-dark-muted">
          {frenchSpacing(site.footer.legal)}
        </p>
      </Container>
    </footer>
  );
}
