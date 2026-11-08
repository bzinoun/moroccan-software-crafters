import type { Metadata } from "next";
import { CardsSection } from "@/components/CardsSection";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { SectionHead } from "@/components/SectionHead";
import { StepRows } from "@/components/StepRows";
import { CtaBand } from "@/components/home/CtaBand";
import { FaqList } from "@/components/home/Faq";
import { TopicWall } from "@/components/home/TopicWall";
import { ZoomSplit } from "@/components/meetup/ZoomSplit";
import { loadEvents, loadMeetup, loadSite } from "@/content/load";
import { frenchSpacing } from "@/lib/french";
import { meetupPhotoUrl } from "@/lib/derive";
import { meetupSteps, meetupTopicBoard } from "@/lib/pages-data";

const site = loadSite();
const meetup = loadMeetup();

// The share image and the share description are hard-coded in the former `meetup.html` (`git show 1353207:meetup.html`), not in
// meetup.json: they are copied here.
const SHARE_DESCRIPTION =
  "Lightning talks, bubble topics, tables rondes : le déroulé d'un samedi matin chez les Moroccan Software Crafters.";
const SHARE_IMAGE = `${site.baseUrl}/assets/img/meetups/2026-03-innovx-3.jpg`;

export const metadata: Metadata = {
  title: meetup.meta.title,
  description: meetup.meta.description,
  openGraph: {
    type: "website",
    title: meetup.meta.title,
    description: SHARE_DESCRIPTION,
    url: `${site.baseUrl}/meetup/`,
    images: [SHARE_IMAGE],
  },
};

// Server component: the sections follow the order and the ids of the root
// former `meetup.html` (other pages link to `#proposer`). The alt texts of the two
// photos are hard-coded in the former `meetup.html`, so they are copied here.
export default function MeetupPage() {
  const m = meetup;
  const events = loadEvents();

  return (
    <>
      <PageHero
        titleId="meetup-title"
        eyebrow={m.hero.eyebrow}
        title={m.hero.title}
        lead={m.hero.lead}
        facts={m.hero.facts}
        image={{
          src: meetupPhotoUrl(m.hero.photo),
          alt: "Participants en cercle pendant un meetup",
        }}
        postit={{ color: "yellow", text: "Vous fixez l'agenda." }}
      />

      <CardsSection
        id="pour-qui"
        titleId="who-title"
        eyebrow={m.who.eyebrow}
        title={m.who.title}
        lead={m.who.text}
        items={m.who.items}
        columns={4}
      />

      <Section variant="alt" id="deroule" aria-labelledby="steps-title">
        <SectionHead
          eyebrow={m.steps.eyebrow}
          title={frenchSpacing(m.steps.title)}
          titleId="steps-title"
        />
        <StepRows
          steps={meetupSteps(m).map(({ photoSrc, ...step }) => ({
            ...step,
            image: photoSrc,
          }))}
        />
      </Section>

      <ZoomSplit
        id="marketplace"
        eyebrow={m.marketplace.eyebrow}
        title={m.marketplace.title}
        steps={m.marketplace.steps}
        image={{
          src: meetupPhotoUrl(m.marketplace.photo),
          alt: "Un participant devant le mur de post-its",
        }}
      />

      <CardsSection
        id="proposer"
        variant="alt"
        titleId="propose-title"
        eyebrow={m.propose.eyebrow}
        title={m.propose.title}
        items={m.propose.items}
        columns={4}
      />

      <CardsSection
        id="regles"
        titleId="rules-title"
        eyebrow={m.rules.eyebrow}
        title={m.rules.title}
        items={m.rules.items}
        columns={3}
      />

      <Section variant="alt" id="sujets" aria-labelledby="topics-title">
        <SectionHead
          eyebrow={m.topicsWall.eyebrow}
          title={frenchSpacing(m.topicsWall.title)}
          titleId="topics-title"
        />
        <TopicWall
          variant="board"
          label={m.topicsWall.title}
          topics={meetupTopicBoard(events)}
        />
      </Section>

      <Section id="faq" aria-labelledby="faq-title">
        <SectionHead
          align="center"
          eyebrow={m.faq.eyebrow}
          title={frenchSpacing(m.faq.title)}
          titleId="faq-title"
        />
        <FaqList items={m.faq.items} />
      </Section>

      <CtaBand
        tight
        variant="green"
        title={m.cta.title}
        text={m.cta.text}
        primary={m.cta.primary}
        secondary={m.cta.secondary}
      />
    </>
  );
}
