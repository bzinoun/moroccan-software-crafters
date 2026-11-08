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
import { meetupPhotoUrl } from "@/lib/derive";
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
import { toRoute } from "@/lib/routes";

const site = loadSite();
const socrates = loadSocrates();

// The share title, description and image are hard-coded in socrates.html, not in
// socrates.json: they are copied here. The hero photo is the default background of
// the old `#hero-bg` when the JSON names none.
const SHARE_TITLE = "SoCraTes Maroc · Devenir partenaire";
const SHARE_DESCRIPTION =
  "Quatre jours d'unconference entre crafters. Trois niveaux de partenariat pour la 5e édition.";
const SHARE_PHOTO = "2022-03-socrates-groupe";

export const metadata: Metadata = {
  title: socrates.meta.title,
  description: socrates.meta.description,
  openGraph: {
    type: "website",
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    url: `${site.baseUrl}/socrates/`,
    images: [`${site.baseUrl}/assets/img/meetups/${SHARE_PHOTO}.jpg`],
  },
};

// Server component: the sections follow the order and the ids of the root
// socrates.html (other pages link to `#sponsoring`; the sponsor sticker links to
// `#sponsor-funnel`). Every eyebrow carries the khatam star on this page.
export default function SocratesPage() {
  const s = socrates;
  const sp = loadSponsoring();
  const companies = loadCompanies();
  const wall = sponsorsWall(companies, loadEvents());
  const hero = s.hero;

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
            <Button variant="primary-flat" href={toRoute(hero.primary.href)}>
              {frenchSpacing(hero.primary.label)}
            </Button>
            <Button
              variant="ghost-on-dark"
              href={toRoute(hero.secondary.href)}
              target="_blank"
              rel="noopener"
            >
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

      <Section variant="alt" id="regles" aria-labelledby="rules-title">
        <SectionHead
          marker="khatam"
          eyebrow={s.openspace.eyebrow}
          title={frenchSpacing(s.openspace.title)}
          lead={s.openspace.lead}
          titleId="rules-title"
        />
        <OpenSpaceLaws laws={socratesLaws(s)} />
        <h3 className="mt-12 mb-[18px]">
          {frenchSpacing(s.openspace.formats.title)}
        </h3>
        <div id="formats">
          <CardGrid items={s.openspace.formats.items} columns={4} />
        </div>
      </Section>

      <Section id="deroule" aria-labelledby="schedule-title">
        <SectionHead
          marker="khatam"
          eyebrow={s.schedule.eyebrow}
          title={frenchSpacing(s.schedule.title)}
          titleId="schedule-title"
        />
        <DayStrip days={s.schedule.days} note={s.schedule.note} />
      </Section>

      <Section variant="alt" id="editions" aria-labelledby="editions-title">
        <SectionHead
          marker="khatam"
          eyebrow={s.editions.eyebrow}
          title={frenchSpacing(s.editions.title)}
          titleId="editions-title"
        />
        <EditionGrid editions={socratesEditionCards(s)} />
      </Section>

      <Section id="famille" aria-labelledby="family-title">
        <SectionHead
          marker="khatam"
          eyebrow={s.family.eyebrow}
          title={frenchSpacing(s.family.title)}
          lead={s.family.text}
          titleId="family-title"
        />
        <FamilyGrid items={socratesFamily(s)} />
      </Section>

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
        packageLevels={Object.fromEntries(
          sp.packages.flatMap((p) => {
            const level = levelForPackage(sp, p.id);
            return level ? [[p.id, level]] : [];
          }),
        )}
        site={{
          links: { linkedin: site.links.linkedin },
          contact: site.contact,
          form: site.form,
        }}
      />

      <Section id="partenaires" aria-labelledby="sponsors-title">
        <SectionHead
          align="center"
          eyebrow={s.sponsorsWall.eyebrow}
          title={frenchSpacing(s.sponsorsWall.title)}
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
