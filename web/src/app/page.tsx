import { LightboxProvider } from "@/components/Lightbox";
import { CtaBand } from "@/components/home/CtaBand";
import { Faq } from "@/components/home/Faq";
import { FormatAgenda } from "@/components/home/FormatAgenda";
import { HistorySection } from "@/components/home/HistorySection";
import { HomeHero } from "@/components/home/HomeHero";
import { OffersSection } from "@/components/home/OffersSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { PhotoGallery } from "@/components/home/PhotoGallery";
import { SocratesTeaser } from "@/components/home/SocratesTeaser";
import { StatsBand } from "@/components/home/StatsBand";
import {
  loadCompanies,
  loadEvents,
  loadHome,
  loadOffers,
  loadSite,
  loadSponsoring,
} from "@/content/load";
import { logoWallTiles } from "@/lib/derive";
import {
  formatSteps,
  galleryItems,
  heroCollage,
  heroNote,
  socratesEditions,
  socratesPhoto,
  statItems,
  topicsFromEvents,
  trustLogos,
} from "@/lib/home-data";

// Server component: every loader reads ../content/*.json at build time. The
// sections follow the order and the ids of the root index.html. The skip link
// target (`main#main`) lives in the layout. The lightbox provider wraps the
// sections that open photos (history and gallery).
export default function Home() {
  const site = loadSite();
  const home = loadHome();
  const events = loadEvents();
  const companies = loadCompanies();
  const offers = loadOffers();
  const sponsoring = loadSponsoring();

  return (
    <LightboxProvider>
      <HomeHero
        hero={home.hero}
        note={heroNote(home, events)}
        collage={heroCollage(home)}
      />
      <StatsBand items={statItems(home, site, events)} />
      <FormatAgenda
        eyebrow={home.format.eyebrow}
        title={home.format.title}
        lead={home.format.lead}
        steps={formatSteps(home)}
        topics={topicsFromEvents(events, home.topics.limit)}
        topicsLabel={home.topics.title}
        more={home.format.more}
      />
      <HistorySection history={home.history} events={events} />
      <PhotoGallery
        eyebrow={home.gallery.eyebrow}
        title={home.gallery.title}
        more={home.gallery.more}
        limit={home.gallery.limit}
        items={galleryItems(events)}
      />
      <PartnersSection
        eyebrow={companies.eyebrow}
        title={companies.title}
        lead={companies.lead}
        tiles={logoWallTiles(companies.items, events)}
        sticker={companies.sticker.host}
      />
      <SocratesTeaser
        eyebrow={home.socrates.eyebrow}
        title={home.socrates.title}
        lead={home.socrates.lead}
        cta={home.socrates.cta}
        editions={socratesEditions(events)}
        photoSrc={socratesPhoto(home)}
        sponsor={home.socrates.sponsor}
        trust={trustLogos(sponsoring, companies.items)}
      />
      <OffersSection
        eyebrow={offers.eyebrow}
        title={offers.title}
        lead={offers.lead}
        note={offers.note}
        items={offers.items}
      />
      <Faq
        eyebrow={home.faq.eyebrow}
        title={home.faq.title}
        items={home.faq.items}
      />
      <CtaBand
        title={home.cta.title}
        text={home.cta.text}
        primary={home.cta.primary}
        secondary={home.cta.secondary}
      />
    </LightboxProvider>
  );
}
