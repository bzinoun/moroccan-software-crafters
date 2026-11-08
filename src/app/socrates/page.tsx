import type { Metadata } from "next";
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
import {
  loadCompanies,
  loadEvents,
  loadSite,
  loadSocrates,
  loadSponsoring,
} from "@/content/load";
import type { Sponsoring } from "@/content/types";
import { meetupPhotoUrl } from "@/lib/derive";
import { formSite } from "@/lib/forms";
import { frenchSpacing } from "@/lib/french";
import { trustLogos } from "@/lib/home-data";
import { pageMetadata } from "@/lib/page-metadata";
import {
  levelForPackage,
  socratesEditionCards,
  socratesFamily,
  socratesLaws,
  sponsorLevels,
  sponsorPackages,
  sponsorsWall,
} from "@/lib/pages-data";

const site = loadSite();
const socrates = loadSocrates();

// The share title, description and image are not in socrates.json. The hero
// photo is the default background when the JSON names none.
const SHARE_TITLE = "SoCraTes Maroc · Devenir partenaire";
const SHARE_DESCRIPTION =
  "Quatre jours d'unconference entre crafters. Trois niveaux de partenariat pour la 5e édition.";
const SHARE_PHOTO = "2022-03-socrates-groupe";

export const metadata: Metadata = pageMetadata({
  path: "/socrates/",
  title: socrates.meta.title,
  description: socrates.meta.description,
  share: { title: SHARE_TITLE, description: SHARE_DESCRIPTION },
  photo: SHARE_PHOTO,
});

/** Package id to the level of the sponsor form that "Choisir ce niveau" checks. */
function packageLevels(sp: Sponsoring): Record<string, string> {
  return Object.fromEntries(
    sp.packages.flatMap((p) => {
      const level = levelForPackage(sp, p.id);
      return level ? [[p.id, level]] : [];
    }),
  );
}

// Server component: other pages link to the section ids (`#sponsoring`; the
// sponsor sticker links to `#sponsor-funnel`). Every eyebrow carries the
// khatam star on this page.
export default function SocratesPage() {
  const s = socrates;
  const sp = loadSponsoring();
  const companies = loadCompanies();
  const wall = sponsorsWall(companies, loadEvents());
  const hero = s.hero;
  const laws = socratesLaws(s);
  const formats = s.openspace.formats;
  const editions = socratesEditionCards(s);
  const family = socratesFamily(s);

  return (
    <>
      <DarkHero
        titleId="socrates-title"
        photo={meetupPhotoUrl(hero.photo || SHARE_PHOTO)}
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
