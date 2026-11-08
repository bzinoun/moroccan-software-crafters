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
import { loadEvents, loadMeetup } from "@/content/load";
import { meetupPhotoUrl } from "@/lib/derive";
import { pageMetadata } from "@/lib/page-metadata";
import { meetupSteps, meetupTopicBoard } from "@/lib/pages-data";

const meetup = loadMeetup();

// The share image and the share description are not in meetup.json.
const SHARE_DESCRIPTION =
  "Lightning talks, bubble topics, tables rondes : le déroulé d'un samedi matin chez les Moroccan Software Crafters.";
const SHARE_PHOTO = "2026-03-innovx-3";

export const metadata: Metadata = pageMetadata({
  path: "/meetup/",
  title: meetup.meta.title,
  description: meetup.meta.description,
  share: { description: SHARE_DESCRIPTION },
  photo: SHARE_PHOTO,
});

// Server component: other pages link to the section ids (`#proposer`). The alt
// texts of the two photos are not in meetup.json. Every section is named by its
// title through `aria-labelledby`.
export default function MeetupPage() {
  const events = loadEvents();

  return (
    <>
      <PageHero
        titleId="meetup-title"
        eyebrow={meetup.hero.eyebrow}
        title={meetup.hero.title}
        lead={meetup.hero.lead}
        facts={meetup.hero.facts}
        image={{
          src: meetupPhotoUrl(meetup.hero.photo),
          alt: "Participants en cercle pendant un meetup",
        }}
        postit={{ color: "yellow", text: "Vous fixez l'agenda." }}
      />

      <CardsSection
        id="pour-qui"
        titleId="who-title"
        eyebrow={meetup.who.eyebrow}
        title={meetup.who.title}
        lead={meetup.who.text}
        items={meetup.who.items}
        columns={4}
      />

      <Section variant="alt" id="deroule" aria-labelledby="steps-title">
        <SectionHead
          eyebrow={meetup.steps.eyebrow}
          title={meetup.steps.title}
          titleId="steps-title"
        />
        <StepRows steps={meetupSteps(meetup)} />
      </Section>

      <ZoomSplit
        id="marketplace"
        eyebrow={meetup.marketplace.eyebrow}
        title={meetup.marketplace.title}
        steps={meetup.marketplace.steps}
        image={{
          src: meetupPhotoUrl(meetup.marketplace.photo),
          alt: "Un participant devant le mur de post-its",
        }}
      />

      <CardsSection
        id="proposer"
        variant="alt"
        titleId="propose-title"
        eyebrow={meetup.propose.eyebrow}
        title={meetup.propose.title}
        items={meetup.propose.items}
        columns={4}
      />

      <CardsSection
        id="regles"
        titleId="rules-title"
        eyebrow={meetup.rules.eyebrow}
        title={meetup.rules.title}
        items={meetup.rules.items}
        columns={3}
      />

      <Section variant="alt" id="sujets" aria-labelledby="topics-title">
        <SectionHead
          eyebrow={meetup.topicsWall.eyebrow}
          title={meetup.topicsWall.title}
          titleId="topics-title"
        />
        <TopicWall
          variant="board"
          label={meetup.topicsWall.title}
          topics={meetupTopicBoard(events)}
        />
      </Section>

      <Section id="faq" aria-labelledby="faq-title">
        <SectionHead
          align="center"
          eyebrow={meetup.faq.eyebrow}
          title={meetup.faq.title}
          titleId="faq-title"
        />
        <FaqList items={meetup.faq.items} />
      </Section>

      <CtaBand
        tight
        variant="green"
        title={meetup.cta.title}
        text={meetup.cta.text}
        primary={meetup.cta.primary}
        secondary={meetup.cta.secondary}
      />
    </>
  );
}
