import { Button } from "@/components/Button";
import { CardGrid } from "@/components/CardGrid";
import { CardsSection } from "@/components/CardsSection";
import { DarkHero } from "@/components/DarkHero";
import { Section } from "@/components/Section";
import { SectionHead } from "@/components/SectionHead";
import { LogoWall } from "@/components/home/LogoWall";
import { DayStrip } from "@/components/socrates/DayStrip";
import { EditionGrid } from "@/components/socrates/EditionGrid";
import { FamilyGrid } from "@/components/socrates/FamilyGrid";
import { OpenSpaceLaws } from "@/components/socrates/OpenSpaceLaws";
import { SponsoringSection } from "@/components/socrates/SponsoringSection";
import type {
  Companies,
  Event,
  Site,
  Socrates,
  Sponsoring,
} from "@/content/types";
import { meetupPhotoUrl } from "@/lib/derive";
import { formSite } from "@/lib/forms";
import { frenchSpacing } from "@/lib/french";
import { trustLogos } from "@/lib/home-data";
import {
  levelForPackage,
  socratesEditionCards,
  socratesFamily,
  socratesLaws,
  sponsorLevels,
  sponsorPackages,
  sponsorsWall,
} from "@/lib/pages-data";

// The hero photo is the default background when socrates.json names none.
const DEFAULT_HERO_PHOTO = "2022-03-socrates-groupe";

/** Package id to the level of the sponsor form that "Choisir ce niveau" checks. */
function packageLevels(sp: Sponsoring): Record<string, string> {
  return Object.fromEntries(
    sp.packages.flatMap((p) => {
      const level = levelForPackage(sp, p.id);
      return level ? [[p.id, level]] : [];
    }),
  );
}

type Props = {
  socrates: Socrates;
  sponsoring: Sponsoring;
  companies: Companies;
  events: Event[];
  site: Site;
};

// Other pages link to the section ids (`#sponsoring`; the sponsor sticker
// links to `#sponsor-funnel`). Every eyebrow carries the khatam star on this
// page.
export function SocratesView({
  socrates: s,
  sponsoring: sp,
  companies,
  events,
  site,
}: Props) {
  const wall = sponsorsWall(companies, events);
  const hero = s.hero;
  const laws = socratesLaws(s);
  const formats = s.openspace.formats;
  const editions = socratesEditionCards(s);
  const family = socratesFamily(s);

  return (
    <>
      <DarkHero
        titleId="socrates-title"
        photo={meetupPhotoUrl(hero.photo || DEFAULT_HERO_PHOTO)}
        eyebrow={hero.eyebrow}
        title={hero.title}
        lead={hero.lead}
        status={hero.status}
        facts={hero.facts}
        actions={
          <>
            <Button variant="primary-flat" href={hero.primary.href}>
              {frenchSpacing(hero.primary.label)}
            </Button>
            <Button variant="ghost-on-dark" href={hero.secondary.href}>
              {frenchSpacing(hero.secondary.label)}
            </Button>
          </>
        }
      />

      <CardsSection
        id="unconference"
        marker="khatam"
        titleId="about-title"
        eyebrow={s.about.eyebrow}
        title={s.about.title}
        lead={s.about.lead}
        items={s.about.pillars}
        columns={3}
      />

      {laws.length > 0 || formats.items.length > 0 ? (
        <Section variant="alt" id="regles" aria-labelledby="rules-title">
          <SectionHead
            marker="khatam"
            eyebrow={s.openspace.eyebrow}
            title={s.openspace.title}
            lead={s.openspace.lead}
            titleId="rules-title"
          />
          <OpenSpaceLaws laws={laws} />
          {formats.items.length > 0 ? (
            <>
              <h3 className="mt-12 mb-4.5">{frenchSpacing(formats.title)}</h3>
              <div id="formats">
                <CardGrid items={formats.items} columns={4} />
              </div>
            </>
          ) : null}
        </Section>
      ) : null}

      {s.schedule.days.length > 0 ? (
        <Section id="deroule" aria-labelledby="schedule-title">
          <SectionHead
            marker="khatam"
            eyebrow={s.schedule.eyebrow}
            title={s.schedule.title}
            titleId="schedule-title"
          />
          <DayStrip days={s.schedule.days} note={s.schedule.note} />
        </Section>
      ) : null}

      {editions.length > 0 ? (
        <Section variant="alt" id="editions" aria-labelledby="editions-title">
          <SectionHead
            marker="khatam"
            eyebrow={s.editions.eyebrow}
            title={s.editions.title}
            titleId="editions-title"
          />
          <EditionGrid editions={editions} />
        </Section>
      ) : null}

      {family.length > 0 ? (
        <Section id="famille" aria-labelledby="family-title">
          <SectionHead
            marker="khatam"
            eyebrow={s.family.eyebrow}
            title={s.family.title}
            lead={s.family.text}
            titleId="family-title"
          />
          <FamilyGrid items={family} />
        </Section>
      ) : null}

      <CardsSection
        id="valeurs"
        marker="khatam"
        variant="alt"
        titleId="values-title"
        eyebrow={s.values.eyebrow}
        title={s.values.title}
        items={s.values.items}
        columns={4}
      />

      <SponsoringSection
        sponsoring={sp}
        trust={trustLogos(sp, companies.items)}
        packages={sponsorPackages(sp)}
        levels={sponsorLevels(sp)}
        packageLevels={packageLevels(sp)}
        site={formSite(site)}
      />

      <Section id="partenaires" aria-labelledby="sponsors-title">
        <SectionHead
          align="center"
          eyebrow={s.sponsorsWall.eyebrow}
          title={s.sponsorsWall.title}
          titleId="sponsors-title"
        />
        <LogoWall
          id="sponsors-wall"
          tiles={wall.tiles}
          sticker={wall.sticker}
        />
      </Section>
    </>
  );
}
