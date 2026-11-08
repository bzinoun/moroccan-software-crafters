import type { Metadata } from "next";
import Link from "next/link";
import { HostFunnel } from "@/components/accueillir/HostFunnel";
import {
  HostHero,
  HostLayout,
  ProcessSteps,
  ProofCard,
  type ProcessStep,
} from "@/components/accueillir/HostLayout";
import { loadEvents, loadOffers, loadSite } from "@/content/load";
import { meetupPhotoUrl } from "@/lib/derive";
import { frenchSpacing } from "@/lib/french";
import { toRoute } from "@/lib/routes";

const site = loadSite();

// former `accueillir.html` (`git show 1353207:accueillir.html`) holds the texts below (not a JSON file), so they are copied here.
const TITLE = "Accueillir un meetup · Moroccan Software Crafters";
const DESCRIPTION =
  "Votre entreprise souhaite accueillir un meetup Moroccan Software Crafters ? Choisissez une formule, proposez une date et nous revenons vers vous sous 48 heures.";
const SHARE_IMAGE = `${site.baseUrl}/assets/img/meetups/2026-05-axa-1.jpg`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    title: "Accueillir un meetup Moroccan Software Crafters",
    description:
      "Gratuit ou en formule partenaire : recevez la communauté Software Craftsmanship dans vos locaux.",
    url: `${site.baseUrl}/accueillir/`,
    images: [SHARE_IMAGE],
  },
};

const STEPS: ProcessStep[] = [
  {
    title: "Vous remplissez ce formulaire",
    text: "Deux minutes : formule, date, capacité, contact.",
  },
  {
    title: "On vous rappelle sous 48 h",
    text: "Un membre de l'équipe valide la date et la logistique avec vous.",
  },
  {
    title: "On annonce l'édition",
    text: "Affiche, page Luma et post LinkedIn, 3 à 4 semaines avant.",
  },
  {
    title: "Le jour J",
    text: "On accueille, on anime, on publie le récap avec photos.",
  },
];

// Server component: reads offers.json, site.json and events.json at build time
// and hands plain props to the client funnel. The photo and its alt text are
// fixed text in the former `accueillir.html`; the sentence under it comes from the latest meetup.
export default function AccueillirPage() {
  const { items } = loadOffers();
  const latest = loadEvents().find((e) => e.type === "meetup");
  const offers = items.map(({ id, name, tagline, price }) => ({
    id,
    name,
    tagline,
    price,
  }));

  return (
    <>
      <HostHero
        eyebrow="Accueillir un meetup"
        title="Recevez 50 crafters un samedi matin."
        lead="Dites-nous quand, combien et dans quelles conditions. Nous revenons vers vous sous 48 heures pour caler les détails."
      />
      <HostLayout
        aside={
          <>
            <ProcessSteps steps={STEPS} />
            <ProofCard
              src={meetupPhotoUrl("2026-10-sg-gscm-5")}
              alt="Participants du dernier meetup"
              edition={
                latest
                  ? {
                      host: latest.host,
                      date: latest.date,
                      registrations: latest.registrations,
                    }
                  : null
              }
            />
            <p className="mt-5 text-[0.9rem] text-muted">
              {frenchSpacing("Vous voulez d'abord comprendre le format ?")}{" "}
              <Link href={toRoute("meetup.html")}>
                {frenchSpacing("Le déroulé d'un meetup, étape par étape.")}
              </Link>
            </p>
          </>
        }
      >
        <HostFunnel
          offers={offers}
          site={{
            links: { linkedin: site.links.linkedin },
            contact: site.contact,
            form: site.form,
          }}
        />
      </HostLayout>
    </>
  );
}
