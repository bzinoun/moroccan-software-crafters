import Link from "next/link";
import { frenchSpacing } from "@/lib/french";
import type { ArticleView as ArticleViewData } from "@/lib/pages-data";
import { md } from "@/lib/md";
import { pageRoute } from "@/lib/routes";
import { Lead } from "../Lead";
import { PageLink } from "../PageLink";
import { Section } from "../Section";
import { TagList } from "../TagList";
import { ArticlePhotosLink } from "./ArticlePhotosLink";
import { Prose } from "./Prose";
import { Photo } from "../Photo";

// Spec: the "ArticleView, Prose" entry in msca-design/COMPONENTS.md; port of the
// detail branch of `news()` in the former `assets/js/pages.js` (`git show 1353207:assets/js/pages.js`) and of `.article` in
// former `assets/css/style.css` (`git show 1353207:assets/css/style.css`). The page needs a `LightboxProvider` above it for the
// "Les N photos" button. Section top padding is 56px, as the old page had.
export function ArticleView({ view }: { view: ArticleViewData }) {
  const hasLinks = view.eventLinks.length > 0 || view.photosLabel !== null;
  return (
    <Section className="zellige-corner pt-14">
      <article className="mx-auto max-w-[760px]">
        <Link
          href={pageRoute("news")}
          className="mb-5 inline-block text-[0.9rem] font-semibold"
        >
          {frenchSpacing("← Toutes les actualités")}
        </Link>
        <p className="mb-[0.6rem] text-[0.9rem] text-muted">
          <span className="mr-2 text-[0.75rem] font-bold tracking-[0.05em] text-green uppercase">
            {frenchSpacing(view.kind)}
          </span>
          {frenchSpacing(view.dateLabel)}
        </p>
        <h1 className="text-[length:clamp(2rem,4vw,3rem)]">
          {frenchSpacing(view.title)}
        </h1>
        <Lead>{view.excerpt}</Lead>
        {view.coverSrc ? (
          <div className="mt-7 mb-9 overflow-hidden rounded-card shadow-lift">
            <Photo
              eager
              src={view.coverSrc}
              alt=""
              className="max-h-[520px] w-full object-cover"
            />
          </div>
        ) : null}
        <Prose>{md(view.body)}</Prose>
        <TagList tags={view.tags} />
        {hasLinks ? (
          <div className="mt-8 flex flex-wrap gap-4 border-t border-line pt-5 text-[0.95rem] font-semibold">
            {view.eventLinks.map((link) => (
              <PageLink key={link.href} href={link.href}>
                {link.label}
              </PageLink>
            ))}
            {view.photosLabel !== null ? (
              <ArticlePhotosLink
                label={frenchSpacing(view.photosLabel)}
                photos={view.photos}
              />
            ) : null}
          </div>
        ) : null}
      </article>
    </Section>
  );
}
