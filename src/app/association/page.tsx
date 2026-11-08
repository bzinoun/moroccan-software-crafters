import type { Metadata } from "next";
import { CardsSection } from "@/components/CardsSection";
import { AssociationHistory } from "@/components/association/HistoryTimeline";
import { HostsSection } from "@/components/association/HostsSection";
import { CtaBand } from "@/components/home/CtaBand";
import { PageHero } from "@/components/PageHero";
import {
  loadAssociation,
  loadCompanies,
  loadEvents,
  loadSite,
} from "@/content/load";
import { meetupPhotoUrl } from "@/lib/derive";
import { frenchSpacing } from "@/lib/french";
import { associationFacts, hostsWall } from "@/lib/pages-data";

const site = loadSite();
const association = loadAssociation();

// Hard-coded in the former `association.html` (`git show 1353207:association.html`), not in association.json.
const SHARE_DESCRIPTION =
  "Une communauté, pas une marque. Mission, principes, histoire et façons de contribuer.";
const HERO_ALT = "Photo de groupe d'un meetup";
const HERO_POSTIT = "Depuis 2019";

export const metadata: Metadata = {
  title: association.meta.title,
  description: association.meta.description,
  openGraph: {
    type: "website",
    title: association.meta.title,
    description: SHARE_DESCRIPTION,
    url: `${site.baseUrl}/association/`,
    // Social tags need full URLs: `site.baseUrl` already carries the base path.
    images: [
      `${site.baseUrl}/assets/img/meetups/${association.hero.photo}.jpg`,
    ],
  },
};

// Server component: every loader reads content/*.json at build time. The
// sections follow the order and the ids of the former `association.html`.
export default function AssociationPage() {
  const events = loadEvents();
  const companies = loadCompanies();
  const wall = hostsWall(companies, events);
  const { hero } = association;

  return (
    <>
      <PageHero
        eyebrow={frenchSpacing(hero.eyebrow)}
        title={frenchSpacing(hero.title)}
        lead={frenchSpacing(hero.lead)}
        facts={associationFacts(site, events)}
        image={{
          src: meetupPhotoUrl(hero.photo),
          alt: HERO_ALT,
          width: 800,
          height: 450,
        }}
        postit={{ color: "green", text: HERO_POSTIT }}
      />
      <CardsSection
        id="mission"
        eyebrow={association.mission.eyebrow}
        title={association.mission.title}
        items={association.mission.items}
        columns={3}
      />
      <CardsSection
        id="principes"
        variant="alt"
        eyebrow={association.principles.eyebrow}
        title={association.principles.title}
        items={association.principles.items}
        columns={3}
      />
      <AssociationHistory history={association.timeline} />
      <HostsSection
        eyebrow={companies.eyebrow}
        title={companies.title}
        tiles={wall.tiles}
        sticker={wall.sticker}
      />
      <CardsSection
        id="contribuer"
        eyebrow={association.contribute.eyebrow}
        title={association.contribute.title}
        items={association.contribute.items}
        columns={4}
      />
      <CtaBand
        tight
        title={association.contact.title}
        text={association.contact.text}
        primary={{ label: "Écrire sur LinkedIn", href: site.links.linkedin }}
        secondary={{ label: "Accueillir un meetup", href: "accueillir.html" }}
      />
    </>
  );
}
