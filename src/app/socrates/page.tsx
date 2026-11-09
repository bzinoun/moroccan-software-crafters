import type { Metadata } from "next";
import { SocratesView } from "@/components/socrates/SocratesView";
import {
  loadCompanies,
  loadEvents,
  loadSite,
  loadSocrates,
  loadSponsoring,
} from "@/content/load";
import { pageMetadata } from "@/lib/page-metadata";

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

// Server component: reads the content files at build time and hands plain
// props to the view.
export default function SocratesPage() {
  return (
    <SocratesView
      socrates={socrates}
      sponsoring={loadSponsoring()}
      companies={loadCompanies()}
      events={loadEvents()}
      site={loadSite()}
    />
  );
}
