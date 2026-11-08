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
import { formSite } from "@/lib/forms";
import { frenchSpacing } from "@/lib/french";
import { pageMetadata } from "@/lib/page-metadata";

const site = loadSite();

// The texts below are not in a JSON file.
const TITLE = "Accueillir un meetup · Moroccan Software Crafters";
const DESCRIPTION =
  "Votre entreprise souhaite accueillir un meetup Moroccan Software Crafters ? Choisissez une formule, proposez une date et nous revenons vers vous sous 48 heures.";
const SHARE_PHOTO = "2026-05-axa-1";

export const metadata: Metadata = pageMetadata({
  path: "/accueillir/",
  title: TITLE,
  description: DESCRIPTION,
  share: {
    title: "Accueillir un meetup Moroccan Software Crafters",
    description:
      "Gratuit ou en formule partenaire : recevez la communauté Software Craftsmanship dans vos locaux.",
  },
  photo: SHARE_PHOTO,
});

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
// and hands plain props to the client funnel. The sentence under the photo
// comes from the latest meetup.
export default function AccueillirPage() {
  const { items } = loadOffers();
  // The same rule as the home note: the latest meetup on or before the build date.
  const today = new Date().toISOString().slice(0, 10);
  const latest = loadEvents().find(
    (e) => e.type === "meetup" && e.date <= today,
  );
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
            <p className="mt-5 text-s90 text-muted">
              {frenchSpacing("Vous voulez d'abord comprendre le format ?")}{" "}
              <Link href={"/meetup/"}>
                {frenchSpacing("Le déroulé d'un meetup, étape par étape.")}
              </Link>
            </p>
          </>
        }
      >
        <HostFunnel offers={offers} site={formSite(site)} />
      </HostLayout>
    </>
  );
}
