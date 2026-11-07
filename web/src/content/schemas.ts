// Zod schemas for the root content/*.json files. Unknown extra keys are
// stripped, not rejected. The compile-time checks at the bottom keep each
// schema output equal to its hand-written type in types.ts.

import { z } from "zod";
import {
  EVENT_TYPES,
  type Companies,
  type Event,
  type Home,
  type Offers,
  type Site,
  type Sponsoring,
} from "./types";

const navLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const ctaSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const statKeySchema = z.enum([
  "events",
  "meetups",
  "hosts",
  "avgRegistrations",
  "followers",
  "socrates",
  "since",
]);

export const siteSchema = z.object({
  name: z.string(),
  shortName: z.string(),
  tagline: z.string(),
  mission: z.string(),
  description: z.string(),
  baseUrl: z.string(),
  since: z.number(),
  linkedinFollowers: z.number(),
  links: z.object({
    linkedin: z.string(),
    socrates: z.string(),
    github: z.string(),
  }),
  contact: z.object({ email: z.string() }),
  form: z.object({
    endpoint: z.string(),
    extraFields: z.record(z.string(), z.string()),
  }),
  nav: z.array(navLinkSchema),
  cta: ctaSchema,
  footer: z.object({ links: z.array(navLinkSchema), legal: z.string() }),
});

export const homeSchema = z.object({
  meta: z.object({ title: z.string(), description: z.string() }),
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    lead: z.string(),
    primary: ctaSchema,
    secondary: ctaSchema,
    note: z.string(),
    collage: z.array(z.object({ photo: z.string(), caption: z.string() })),
    postit: z.string(),
  }),
  stats: z.array(
    z.object({
      key: statKeySchema.optional(),
      value: z.union([z.string(), z.number()]).optional(),
      label: z.string(),
    }),
  ),
  format: z.object({
    eyebrow: z.string(),
    title: z.string(),
    lead: z.string(),
    steps: z.array(
      z.object({
        time: z.string(),
        title: z.string(),
        text: z.string(),
        photo: z.string().optional(),
      }),
    ),
    more: ctaSchema,
  }),
  topics: z.object({ title: z.string(), limit: z.number() }),
  history: z.object({
    eyebrow: z.string(),
    title: z.string(),
    lead: z.string(),
    filters: z.array(z.object({ value: z.string(), label: z.string() })),
    limit: z.number(),
    more: z.string(),
  }),
  gallery: z.object({
    eyebrow: z.string(),
    title: z.string(),
    limit: z.number(),
    more: z.string(),
  }),
  socrates: z.object({
    eyebrow: z.string(),
    title: z.string(),
    lead: z.string(),
    photo: z.string(),
    cta: ctaSchema,
    sponsor: z.object({
      eyebrow: z.string(),
      title: z.string(),
      text: z.string(),
      cta: ctaSchema,
    }),
  }),
  faq: z.object({
    eyebrow: z.string(),
    title: z.string(),
    items: z.array(z.object({ q: z.string(), a: z.string() })),
  }),
  cta: z.object({
    title: z.string(),
    text: z.string(),
    primary: ctaSchema,
    secondary: ctaSchema,
  }),
});

export const eventSchema = z.object({
  id: z.string(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}(-\d{2})?$/, "expected YYYY-MM-DD or YYYY-MM"),
  type: z.enum(EVENT_TYPES),
  title: z.string(),
  host: z.string().optional(),
  venue: z.string().optional(),
  city: z.string(),
  topics: z.array(z.string()).optional(),
  summary: z.string().optional(),
  registrations: z.number().optional(),
  participants: z.number().optional(),
  sponsors: z.array(z.string()).optional(),
  photos: z.array(z.string()).optional(),
  poster: z.string().optional(),
  links: z
    .object({
      linkedin: z.string().optional(),
      luma: z.string().optional(),
      site: z.string().optional(),
    })
    .optional(),
});

export const eventsSchema = z.array(eventSchema);

const stickerSchema = z.object({
  title: z.string(),
  text: z.string(),
  label: z.string(),
  href: z.string(),
});

export const companiesSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  lead: z.string(),
  sticker: z.object({ host: stickerSchema, sponsor: stickerSchema }),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      display: z.string(),
      logo: z.string(),
      linkedin: z.string(),
    }),
  ),
});

export const offersSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  lead: z.string(),
  note: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.string().optional(),
      highlight: z.boolean().optional(),
      badge: z.string().optional(),
      tagline: z.string(),
      youProvide: z.array(z.string()),
      weProvide: z.array(z.string()),
    }),
  ),
});

export const sponsoringSchema = z.object({
  nextEdition: z.object({
    label: z.string(),
    year: z.string(),
    dates: z.string(),
    venue: z.string(),
    city: z.string(),
    capacity: z.number(),
    status: z.string(),
  }),
  eyebrow: z.string(),
  title: z.string(),
  lead: z.string(),
  arguments: z.array(z.object({ title: z.string(), text: z.string() })),
  trust: z.object({ title: z.string(), ids: z.array(z.string()) }),
  packages: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.string(),
      highlight: z.boolean().optional(),
      badge: z.string().optional(),
      limit: z.string().optional(),
      tagline: z.string(),
      includes: z.array(z.string()),
    }),
  ),
  inKind: z.object({ title: z.string(), text: z.string() }),
  note: z.string(),
  faq: z.array(z.object({ q: z.string(), a: z.string() })),
  form: z.object({
    title: z.string(),
    lead: z.string(),
    success: z.string(),
  }),
});

// Compile-time check: each schema and its hand-written type in types.ts describe one shape.
type Equal<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
type Check<T extends true> = T;
export type SiteSchemaMatchesType = Check<
  Equal<z.infer<typeof siteSchema>, Site>
>;
export type HomeSchemaMatchesType = Check<
  Equal<z.infer<typeof homeSchema>, Home>
>;
export type EventSchemaMatchesType = Check<
  Equal<z.infer<typeof eventSchema>, Event>
>;
export type CompaniesSchemaMatchesType = Check<
  Equal<z.infer<typeof companiesSchema>, Companies>
>;
export type OffersSchemaMatchesType = Check<
  Equal<z.infer<typeof offersSchema>, Offers>
>;
export type SponsoringSchemaMatchesType = Check<
  Equal<z.infer<typeof sponsoringSchema>, Sponsoring>
>;
