import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { HeroEm } from "@/components/HeroEm";
import { loadHome } from "@/content/load";
import { frenchSpacing } from "@/lib/french";
import { toRoute } from "@/lib/routes";

// Placeholder home: the hero text and buttons only. The collage, the post-it,
// the hero note and the other sections come in later steps.
// The two-column grid starts at `lg` (the old site switched at 900px, which
// is not a default Tailwind breakpoint).
export default function Home() {
  const { hero } = loadHome();

  return (
    <section className="zellige-corner overflow-hidden pt-16 pb-10">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.08em] text-red uppercase before:h-0.5 before:w-[22px] before:bg-red before:content-['']">
            {frenchSpacing(hero.eyebrow)}
          </p>
          <h1>
            <HeroEm text={hero.title} />
          </h1>
          <p className="mb-[1.8rem] max-w-[60ch] text-[1.15rem] text-ink-soft">
            {frenchSpacing(hero.lead)}
          </p>
          <div className="flex flex-wrap gap-[0.8rem]">
            <Button href={toRoute(hero.primary.href)}>
              {frenchSpacing(hero.primary.label)}
            </Button>
            <Button variant="ghost" href={toRoute(hero.secondary.href)}>
              {frenchSpacing(hero.secondary.label)}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
