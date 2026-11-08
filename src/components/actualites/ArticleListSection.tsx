import { Eyebrow } from "../Eyebrow";
import { HeroEm } from "../HeroEm";
import { Lead } from "../Lead";
import { Section } from "../Section";
import type { ArticleCard as ArticleCardData } from "@/lib/pages-data";
import { ArticleGrid } from "./ArticleGrid";

// Port of the list branch of `news()` in the former `assets/js/pages.js` (`git show 1353207:assets/js/pages.js`) and of the section
// of the former `actualites.html` (`git show 1353207:actualites.html`): a section with 56px of top padding, a head whose title
// is the page `h1` (SectionHead renders an `h2`), then the grid.
type ArticleListSectionProps = {
  /** `articles.eyebrow`. */
  eyebrow: string;
  /** `articles.title`; may hold one `<em>`. */
  title: string;
  /** `articles.lead`. */
  lead: string;
  /** `articleCards(articles)`. */
  articles: ArticleCardData[];
};

export function ArticleListSection({
  eyebrow,
  title,
  lead,
  articles,
}: ArticleListSectionProps) {
  return (
    <Section className="zellige-corner pt-14">
      <div className="mb-11 max-w-[760px]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>
          <HeroEm text={title} />
        </h1>
        <Lead>{lead}</Lead>
      </div>
      <ArticleGrid articles={articles} />
    </Section>
  );
}
