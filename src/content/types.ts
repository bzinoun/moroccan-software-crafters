// Types of the root content/*.json files. Each one is the `z.infer` of a schema
// in schemas.ts, so the schema is the only place that declares a shape.

import type { z } from "zod";
import type {
  articlesSchema,
  associationSchema,
  companiesSchema,
  companySchema,
  ctaSchema,
  eventSchema,
  factSchema,
  historyFilterSchema,
  homeSchema,
  meetupSchema,
  offerSchema,
  offersSchema,
  siteSchema,
  socratesSchema,
  sponsoringSchema,
  stickerSchema,
} from "./schemas";

/** A label with a route (for example "/meetup/#proposer") or an absolute URL. */
export type Cta = z.infer<typeof ctaSchema>;
export type Site = z.infer<typeof siteSchema>;
export type HistoryFilter = z.infer<typeof historyFilterSchema>;
export type Home = z.infer<typeof homeSchema>;
export type Event = z.infer<typeof eventSchema>;
export type EventType = Event["type"];
export type Company = z.infer<typeof companySchema>;
export type Sticker = z.infer<typeof stickerSchema>;
export type Companies = z.infer<typeof companiesSchema>;
export type Offer = z.infer<typeof offerSchema>;
export type Offers = z.infer<typeof offersSchema>;
export type Sponsoring = z.infer<typeof sponsoringSchema>;
/** A figure with its caption, for the hero fact lists. */
export type Fact = z.infer<typeof factSchema>;
export type Meetup = z.infer<typeof meetupSchema>;
export type Association = z.infer<typeof associationSchema>;
/** content/socrates.json as stored: editions link to events by id. */
export type SocratesFile = z.infer<typeof socratesSchema>;
/** The SoCraTes page content: editions and hero facts resolved from the events. */
export type Socrates = Omit<SocratesFile, "hero" | "editions"> & {
  hero: Omit<SocratesFile["hero"], "facts"> & { facts: Fact[] };
  editions: Omit<SocratesFile["editions"], "items"> & {
    items: {
      year: string;
      /** "1re édition". */
      edition: string;
      city: string;
      venue?: string;
      /** "25 → 27 mars". */
      dates: string;
      participants: number;
      partners: number;
      photo?: string;
      text: string;
    }[];
  };
};
export type Articles = z.infer<typeof articlesSchema>;
export type Article = Articles["items"][number];
/** "Annonce" or "Récap". */
export type ArticleKind = Article["kind"];

/** Page ids; `PageFrame` sets the current one as `data-page` on its wrapper. */
export type PageId =
  "home" | "meetup" | "socrates" | "news" | "association" | "host";
