import Link from "next/link";
import { HostFunnel } from "@/components/accueillir/HostFunnel";
import {
  HostHero,
  HostLayout,
  ProcessSteps,
  ProofCard,
  type ProcessStep,
} from "@/components/accueillir/HostLayout";
import type { Event, Offers, Site } from "@/content/types";
import { meetupPhotoUrl } from "@/lib/derive";
import { formSite } from "@/lib/forms";
import { frenchSpacing } from "@/lib/french";

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

type Props = {
  offers: Offers;
  events: Event[];
  site: Site;
  /** The build date as YYYY-MM-DD. */
  today: string;
};

// The sentence under the photo comes from the latest meetup on or before
// today, the same rule as the home note.
export function AccueillirView({ offers, events, site, today }: Props) {
  const latest = events.find((e) => e.type === "meetup" && e.date <= today);
  const funnelOffers = offers.items.map(({ id, name, tagline, price }) => ({
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
        <HostFunnel offers={funnelOffers} site={formSite(site)} />
      </HostLayout>
    </>
  );
}
