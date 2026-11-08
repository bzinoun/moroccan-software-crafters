import Link from "next/link";
import { useId } from "react";
import { cn } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import type { ArticleCard as ArticleCardData } from "@/lib/pages-data";
import { Reveal } from "../Reveal";
import { TagList } from "../TagList";
import { Photo } from "../Photo";

// Spec: the "ArticleGrid, ArticleCard" entry in msca-design/COMPONENTS.md; port
// of `.article-card` and `.lead-card` in the former `assets/css/style.css` (`git show 1353207:assets/css/style.css`). The whole card
// is one link, named by its title. The newest article (`lead`) spans the full
// row of the list; it is horizontal from `lg` (old query 960px) and stacked below, with a
// 16/9 cover. The article wrapper carries the reveal and the link carries the
// hover, as the old anchor did both.

const WRAPPER = "flex min-w-0";

const CARD =
  "flex flex-1 flex-col overflow-hidden rounded-card bg-white text-ink no-underline shadow-card hover:text-ink hover:shadow-lift motion-safe:transition-[translate,box-shadow] motion-safe:duration-200 motion-safe:hover:-translate-y-0.75";

export function ArticleCard({ article }: { article: ArticleCardData }) {
  const titleId = useId();
  const { lead } = article;
  return (
    <Reveal as="article" className={cn(WRAPPER, lead && "col-span-full")}>
      <Link
        href={article.href}
        aria-labelledby={titleId}
        className={cn(CARD, lead && "lg:flex-row")}
      >
        <div
          className={cn(
            "aspect-16/10 overflow-hidden bg-paper-2",
            lead && "aspect-video lg:aspect-auto lg:w-[55%] lg:shrink-0",
          )}
        >
          {article.coverSrc ? (
            <Photo
              src={article.coverSrc}
              alt=""
              className="size-full object-cover"
            />
          ) : null}
        </div>
        <div
          className={cn(
            "flex flex-1 flex-col px-5 pt-4.5 pb-5.5",
            lead && "justify-center px-8.5 py-8",
          )}
        >
          <p className="mb-[0.4rem] text-[0.8rem] text-muted">
            <span className="mr-2 text-[0.72rem] font-bold tracking-[0.05em] text-green uppercase">
              {frenchSpacing(article.kind)}
            </span>
            {frenchSpacing(article.dateLabel)}
          </p>
          <h3
            id={titleId}
            className={cn("text-[1.2rem]", lead && "text-[1.9rem]")}
          >
            {frenchSpacing(article.title)}
          </h3>
          <p className="mb-[0.8rem] text-[0.93rem] text-ink-soft">
            {frenchSpacing(article.excerpt)}
          </p>
          <TagList
            tags={article.tags}
            className={cn("mt-auto mb-0", lead && "mt-0")}
          />
        </div>
      </Link>
    </Reveal>
  );
}
