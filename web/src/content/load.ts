// Typed loader for the root content/*.json files.
// The JSON files at the repo root stay the single source of truth.
// Schemas live in schemas.ts and types in types.ts; this module reads and parses.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { z } from "zod";
import {
  articlesSchema,
  associationSchema,
  companiesSchema,
  eventsSchema,
  homeSchema,
  meetupSchema,
  offersSchema,
  siteSchema,
  socratesSchema,
  sponsoringSchema,
} from "./schemas";
import type {
  Articles,
  Association,
  Companies,
  Event,
  Home,
  Meetup,
  Offers,
  Site,
  Socrates,
  Sponsoring,
} from "./types";

export { homeSchema, siteSchema } from "./schemas";

// Resolved from this module, so the same path works in Vitest and in `next build`.
const contentDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../content",
);

function readJson(file: string): unknown {
  return JSON.parse(readFileSync(path.join(contentDir, file), "utf8"));
}

function parseWith<T>(schema: z.ZodType<T>, json: unknown, file: string): T {
  const result = schema.safeParse(json);
  if (result.success) return result.data;
  const issues = result.error.issues
    .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid content in ${file}: ${issues}`);
}

/** Exposed for tests. Prefer `loadSite()`. */
export function parseSite(json: unknown, file: string): Site {
  return parseWith(siteSchema, json, file);
}

/** Exposed for tests. Prefer `loadHome()`. */
export function parseHome(json: unknown, file: string): Home {
  return parseWith(homeSchema, json, file);
}

/** Exposed for tests. Prefer `loadEvents()`. */
export function parseEvents(json: unknown, file: string): Event[] {
  return parseWith(eventsSchema, json, file);
}

/** Exposed for tests. Prefer `loadCompanies()`. */
export function parseCompanies(json: unknown, file: string): Companies {
  return parseWith(companiesSchema, json, file);
}

/** Exposed for tests. Prefer `loadOffers()`. */
export function parseOffers(json: unknown, file: string): Offers {
  return parseWith(offersSchema, json, file);
}

/** Exposed for tests. Prefer `loadSponsoring()`. */
export function parseSponsoring(json: unknown, file: string): Sponsoring {
  return parseWith(sponsoringSchema, json, file);
}

/** Exposed for tests. Prefer `loadMeetup()`. */
export function parseMeetup(json: unknown, file: string): Meetup {
  return parseWith(meetupSchema, json, file);
}

/** Exposed for tests. Prefer `loadAssociation()`. */
export function parseAssociation(json: unknown, file: string): Association {
  return parseWith(associationSchema, json, file);
}

/** Exposed for tests. Prefer `loadSocrates()`. */
export function parseSocrates(json: unknown, file: string): Socrates {
  return parseWith(socratesSchema, json, file);
}

/** Exposed for tests. Prefer `loadArticles()`. */
export function parseArticles(json: unknown, file: string): Articles {
  return parseWith(articlesSchema, json, file);
}

export function loadSite(): Site {
  return parseSite(readJson("site.json"), "content/site.json");
}

export function loadHome(): Home {
  return parseHome(readJson("home.json"), "content/home.json");
}

/** All events of content/events.json, in file order (newest first). */
export function loadEvents(): Event[] {
  return parseEvents(readJson("events.json"), "content/events.json");
}

export function loadCompanies(): Companies {
  return parseCompanies(readJson("companies.json"), "content/companies.json");
}

export function loadOffers(): Offers {
  return parseOffers(readJson("offers.json"), "content/offers.json");
}

export function loadSponsoring(): Sponsoring {
  return parseSponsoring(
    readJson("sponsoring.json"),
    "content/sponsoring.json",
  );
}

export function loadMeetup(): Meetup {
  return parseMeetup(readJson("meetup.json"), "content/meetup.json");
}

export function loadAssociation(): Association {
  return parseAssociation(
    readJson("association.json"),
    "content/association.json",
  );
}

export function loadSocrates(): Socrates {
  return parseSocrates(readJson("socrates.json"), "content/socrates.json");
}

/** All articles of content/articles.json, in file order. Slugs are unique. */
export function loadArticles(): Articles {
  return parseArticles(readJson("articles.json"), "content/articles.json");
}
