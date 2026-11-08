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

// Spec: the "ArticleView, Prose" entry in msca-design/COMPONENTS.md.
// The page needs a `LightboxProvider` above it for the "Les N photos" link.
const TITLE_ID = "article-title";

export function ArticleView({ view }: { view: ArticleViewData }) {
  const hasLinks = view.eventLinks.length > 0 || view.photosLabel !== null;
  return (
    <Section className="zellige-corner pt-14" aria-labelledby={TITLE_ID}>
      <article className="mx-auto max-w-[760px]">
        <Link
          href={pageRoute("news")}
          className="mb-5 inline-block text-s90 font-semibold"
        >
          {frenchSpacing("← Toutes les actualités")}
        </Link>
        <p className="mb-[0.6rem] text-s90 text-muted">
          <span className="mr-2 text-[0.75rem] font-bold tracking-[0.05em] text-green uppercase">
            {frenchSpacing(view.kind)}
          </span>
          {frenchSpacing(view.dateLabel)}
        </p>
        <h1
          id={TITLE_ID}
          className="text-[length:clamp(2rem,4vw,3rem)] break-words"
        >
          {frenchSpacing(view.title)}
        </h1>
        <Lead>{view.excerpt}</Lead>
        {view.coverSrc ? (
          <div className="mt-7 mb-9 overflow-hidden rounded-card shadow-lift">
            <Photo
              eager
              src={view.coverSrc}
              alt=""
              className="max-h-130 w-full object-cover"
            />
          </div>
        ) : null}
        <Prose>{md(view.body)}</Prose>
        <TagList tags={view.tags} />
        {hasLinks ? (
          <div className="mt-8 flex flex-wrap gap-4 border-t border-line pt-5 text-s95 font-semibold">
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
