import type { ComponentProps } from "react";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { FactList, type Fact } from "./FactList";
import { HeroEm } from "./HeroEm";
import { Lead } from "./Lead";
import { PostIt } from "./PostIt";

// Spec: the "PageHero" entry in msca-design/COMPONENTS.md; port of `.page-hero`.
// The hero of an inner page: text and facts on the left, a tilted photo with an
// overlapping post-it on the right, one zellige corner. The two columns start
// at `lg` (the old site switched at 900px); the photo then stacks under the text.

type PageHeroProps = {
  eyebrow: string;
  /** May hold one `<em>` around the emphasized word. */
  title: string;
  lead: string;
  /** Two columns at every width. Nothing renders when empty or missing. */
  facts?: readonly Fact[];
  image: {
    /** Final URL, base path included: `meetupPhotoUrl(name)` or `assetUrl(...)`. */
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  postit?: {
    color?: ComponentProps<typeof PostIt>["color"];
    text: string;
  };
  /** Id of the title, for `aria-labelledby` on the section. */
  titleId?: string;
};

export function PageHero({
  eyebrow,
  title,
  lead,
  facts,
  image,
  postit,
  titleId,
}: PageHeroProps) {
  return (
    <section className="zellige-corner pt-16 pb-10" aria-labelledby={titleId}>
      <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 id={titleId}>
            <HeroEm text={title} />
          </h1>
          <Lead>{lead}</Lead>
          {facts ? (
            <FactList
              items={facts}
              className="mt-8 sm:grid-cols-[repeat(2,1fr)]"
            />
          ) : null}
        </div>
        <figure className="relative m-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- exported site, images are unoptimized */}
          <img
            src={image.src}
            alt={image.alt}
            width={image.width ?? 800}
            height={image.height ?? 600}
            className="aspect-[4/3] w-full rotate-[1.5deg] rounded-card object-cover shadow-lift"
          />
          {postit ? (
            <PostIt
              color={postit.color}
              className="absolute -bottom-4 -left-3.5 rotate-[-4deg]"
            >
              {postit.text}
            </PostIt>
          ) : null}
        </figure>
      </Container>
    </section>
  );
}
