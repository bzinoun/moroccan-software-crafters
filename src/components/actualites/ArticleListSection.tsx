import { Eyebrow } from "../Eyebrow";
import { HeroEm } from "../HeroEm";
import { Lead } from "../Lead";
import { Section } from "../Section";
import type { ArticleCard } from "@/lib/pages-data";
import { ArticleGrid } from "./ArticleGrid";

// The news list: a section with 56px of top padding, a head whose title is the
// page `h1` (SectionHead renders an `h2`), then the cards. The cards use `h2`.
const TITLE_ID = "news-title";

type ArticleListSectionProps = {
  /** `articles.eyebrow`. */
  eyebrow: string;
  /** `articles.title`; may hold one `<em>`. */
  title: string;
  /** `articles.lead`. */
  lead: string;
  /** `articleCards(articles)`. */
  articles: ArticleCard[];
};

export function ArticleListSection({
  eyebrow,
  title,
  lead,
  articles,
}: ArticleListSectionProps) {
  return (
    <Section className="zellige-corner pt-14" aria-labelledby={TITLE_ID}>
      <div className="mb-11 max-w-[760px]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 id={TITLE_ID}>
          <HeroEm text={title} />
        </h1>
        <Lead>{lead}</Lead>
      </div>
      <ArticleGrid articles={articles} />
    </Section>
  );
}
