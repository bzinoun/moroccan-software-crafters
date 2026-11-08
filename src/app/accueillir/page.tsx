import type { Metadata } from "next";
import { AccueillirView } from "@/components/accueillir/AccueillirView";
import { loadEvents, loadOffers, loadSite } from "@/content/load";
import { pageMetadata } from "@/lib/page-metadata";
import { systemClock } from "@/lib/ports/clock";

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

// Server component: reads offers.json, site.json and events.json at build time
// and hands plain props to the view.
export default function AccueillirPage() {
  return (
    <AccueillirView
      offers={loadOffers()}
      events={loadEvents()}
      site={loadSite()}
      today={systemClock.now().toISOString().slice(0, 10)}
    />
  );
}
