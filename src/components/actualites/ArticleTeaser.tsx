import Link from "next/link";
import { useId } from "react";
import { tv } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import type { ArticleCard } from "@/lib/pages-data";
import { Reveal } from "../Reveal";
import { TagList } from "../TagList";
import { Photo } from "../Photo";

// Spec: the "ArticleGrid, ArticleTeaser, ArticleListSection" entry in msca-design/COMPONENTS.md
// (the component is `ArticleTeaser` so that it does not share the name of its
// data type `ArticleCard`). The whole card is one link, named by its title.
// The newest article (`lead`) spans the full row of the list; it is horizontal
// from `lg` and stacked below, with a 16/9 cover. The article wrapper carries
// the reveal and the link carries the hover.
const teaserStyles = tv({
  slots: {
    wrapper: "flex min-w-0",
    link: "flex flex-1 flex-col overflow-hidden rounded-card bg-white text-ink no-underline shadow-card hover:text-ink hover:shadow-lift motion-safe:transition-[translate,box-shadow] motion-safe:duration-200 motion-safe:hover:-translate-y-0.75",
    cover: "aspect-16/10 overflow-hidden bg-paper-2",
    body: "flex flex-1 flex-col px-5 pt-4.5 pb-5.5",
    // A long unbroken word wraps instead of widening the card.
    title: "text-s120 break-words",
    tags: "mt-auto mb-0",
  },
  variants: {
    lead: {
      true: {
        wrapper: "col-span-full",
        link: "lg:flex-row",
        cover: "aspect-video lg:aspect-auto lg:w-[55%] lg:shrink-0",
        body: "justify-center px-8.5 py-8",
        title: "text-s190",
        tags: "mt-0",
      },
      false: {},
    },
  },
  defaultVariants: { lead: false },
});

export function ArticleTeaser({ article }: { article: ArticleCard }) {
  const titleId = useId();
  const styles = teaserStyles({ lead: article.lead });
  return (
    <Reveal as="article" className={styles.wrapper()}>
      <Link
        href={article.href}
        aria-labelledby={titleId}
        className={styles.link()}
      >
        <div className={styles.cover()}>
          {article.coverSrc ? (
            <Photo
              src={article.coverSrc}
              alt=""
              className="size-full object-cover"
            />
          ) : null}
        </div>
        <div className={styles.body()}>
          <p className="mb-[0.4rem] text-s80 text-muted">
            <span className="mr-2 text-s72 font-bold tracking-[0.05em] text-green uppercase">
              {frenchSpacing(article.kind)}
            </span>
            {frenchSpacing(article.dateLabel)}
          </p>
          <h2 id={titleId} className={styles.title()}>
            {frenchSpacing(article.title)}
          </h2>
          <p className="mb-[0.8rem] text-s93 text-ink-soft">
            {frenchSpacing(article.excerpt)}
          </p>
          <TagList tags={article.tags} className={styles.tags()} />
        </div>
      </Link>
    </Reveal>
  );
}
