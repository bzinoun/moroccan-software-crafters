import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Eyebrow } from "@/components/Eyebrow";
import { HeroEm } from "@/components/HeroEm";
import { Lead } from "@/components/Lead";
import { PostIt } from "@/components/PostIt";
import type { Home } from "@/content/types";
import { frenchSpacing } from "@/lib/french";
import { Polaroid, POLAROID_SLOTS } from "./Polaroid";

// Spec: the "HomeHero, PolaroidCollage, Polaroid" entry in msca-design/COMPONENTS.md.
// The collage is decorative, so the whole box is removed from assistive
// technology. The two columns start at `lg`; the collage stacks under the text
// below it. Only the first photos that have a slot show.
type HomeHeroProps = {
  /** `home.hero` from `loadHome()`. Its `collage` is ignored: pass `collage`. */
  hero: Home["hero"];
  /** `heroNote(home, events)`. Nothing renders when it is empty. */
  note: string;
  /** `heroCollage(home)`: photo URL and caption, in display order. */
  collage: { src: string; caption: string }[];
};

export function HomeHero({ hero, note, collage }: HomeHeroProps) {
  return (
    <section className="zellige-corner overflow-hidden pt-16 pb-10">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <h1>
            <HeroEm text={hero.title} />
          </h1>
          <Lead className="mb-[1.8rem]">{hero.lead}</Lead>
          <div className="flex flex-wrap gap-[0.8rem]">
            <Button href={hero.primary.href}>
              {frenchSpacing(hero.primary.label)}
            </Button>
            <Button variant="ghost" href={hero.secondary.href}>
              {frenchSpacing(hero.secondary.label)}
            </Button>
          </div>
          {note ? (
            <p className="mt-[1.4rem] text-s90 text-muted">
              {frenchSpacing(note)}
            </p>
          ) : null}
        </div>
        <div aria-hidden="true" className="relative h-95 lg:h-120">
          {collage.slice(0, POLAROID_SLOTS).map((photo, index) => (
            <Polaroid
              key={`${index}-${photo.src}`}
              index={index}
              src={photo.src}
              caption={photo.caption}
            />
          ))}
          <PostIt className="absolute top-2.5 right-[6%] z-5 w-35 rotate-5 text-s115 lg:w-42.5 lg:text-s135">
            {hero.postit}
          </PostIt>
        </div>
      </Container>
    </section>
  );
}
