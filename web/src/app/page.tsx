import Link from "next/link";
import { HeroEm } from "@/components/HeroEm";
import { loadHome } from "@/content/load";
import { frenchSpacing } from "@/lib/french";
import { toRoute } from "@/lib/routes";

// Placeholder home: the hero text and buttons only. The collage, the post-it,
// the hero note and the other sections come in later steps.
export default function Home() {
  const { hero } = loadHome();

  return (
    <section className="hero">
      <div className="wrap">
        <div>
          <p className="eyebrow">{frenchSpacing(hero.eyebrow)}</p>
          <h1>
            <HeroEm text={hero.title} />
          </h1>
          <p className="lead">{frenchSpacing(hero.lead)}</p>
          <div className="btn-row">
            <Link className="btn btn-primary" href={toRoute(hero.primary.href)}>
              {frenchSpacing(hero.primary.label)}
            </Link>
            <Link className="btn btn-ghost" href={toRoute(hero.secondary.href)}>
              {frenchSpacing(hero.secondary.label)}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
