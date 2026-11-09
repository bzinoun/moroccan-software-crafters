// Zod schemas for the root content/*.json files. Unknown extra keys are
// stripped, not rejected. The types of types.ts are `z.infer` of these
// schemas, so a shape is declared once.

import { z } from "zod";

/** A label with a route (for example "/meetup/#proposer") or a full URL. */
export const ctaSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const EVENT_TYPES = ["meetup", "socrates", "codesnack", "online"] as const;

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
  tagline: z.string(),
  mission: z.string(),
  baseUrl: z.string(),
  since: z.number(),
  linkedinFollowers: z.number(),
  links: z.object({ linkedin: z.string() }),
  contact: z.object({ email: z.string() }),
  form: z.object({
    endpoint: z.string(),
    extraFields: z.record(z.string(), z.string()),
  }),
  nav: z.array(ctaSchema),
  cta: ctaSchema,
  footer: z.object({ links: z.array(ctaSchema), legal: z.string() }),
});

export const historyFilterSchema = z.object({
  /** "all" or an event type. */
  value: z.string(),
  label: z.string(),
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
    filters: z.array(historyFilterSchema),
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
    photo: z.string().min(1),
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

/** A real calendar day, "YYYY-MM-DD": "2026-02-45" and "2026-02-30" are refused. */
const daySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD")
  .refine(
    (iso) => {
      const [y, m, d] = iso.split("-").map(Number) as [number, number, number];
      const date = new Date(Date.UTC(y, m - 1, d));
      return (
        date.getUTCFullYear() === y &&
        date.getUTCMonth() === m - 1 &&
        date.getUTCDate() === d
      );
    },
    { message: "not a day of the calendar" },
  );

/** A real day "YYYY-MM-DD", or a month alone "YYYY-MM" (month 01 to 12). */
const dateOrMonthSchema = z.union(
  [daySchema, z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/)],
  { error: "expected a real day YYYY-MM-DD or a month YYYY-MM" },
);

export const eventSchema = z
  .object({
    id: z.string(),
    date: dateOrMonthSchema,
    /** Last day of an event that lasts several days, "YYYY-MM-DD". */
    endDate: daySchema.optional(),
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
    links: z
      .object({
        linkedin: z.string().optional(),
        luma: z.string().optional(),
        site: z.string().optional(),
      })
      .optional(),
  })
  .refine((e) => e.endDate === undefined || e.endDate >= e.date, {
    path: ["endDate"],
    message: "the end date is before the start date",
  })
  // A range such as "2026-03" to "2026-03-27" has no first day to print.
  .refine((e) => e.endDate === undefined || e.date.length === 10, {
    path: ["endDate"],
    message: "an end date needs a start date with a day (YYYY-MM-DD)",
  });

export const eventsSchema = z.array(eventSchema);

export const stickerSchema = z.object({
  title: z.string(),
  text: z.string(),
  label: z.string(),
  href: z.string(),
});

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  display: z.string(),
  logo: z.string(),
  linkedin: z.string(),
});

export const companiesSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  lead: z.string(),
  sticker: z.object({ host: stickerSchema, sponsor: stickerSchema }),
  items: z.array(companySchema),
});

export const offerSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string().optional(),
  highlight: z.boolean().optional(),
  badge: z.string().optional(),
  tagline: z.string(),
  youProvide: z.array(z.string()),
  weProvide: z.array(z.string()),
});

export const offersSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  lead: z.string(),
  note: z.string(),
  items: z.array(offerSchema),
});

export const sponsoringSchema = z.object({
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

const metaSchema = z.object({ title: z.string(), description: z.string() });

const cardSchema = z.object({
  title: z.string(),
  text: z.string(),
  href: z.string().optional(),
  label: z.string().optional(),
});

const sectionHeadSchema = { eyebrow: z.string(), title: z.string() };

export const factSchema = z.object({ value: z.string(), label: z.string() });

export const meetupSchema = z.object({
  meta: metaSchema,
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    lead: z.string(),
    photo: z.string(),
    facts: z.array(factSchema),
  }),
  who: z.object({
    ...sectionHeadSchema,
    text: z.string(),
    items: z.array(cardSchema),
  }),
  steps: z.object({
    ...sectionHeadSchema,
    items: z.array(
      z.object({
        id: z.string(),
        time: z.string(),
        title: z.string(),
        kicker: z.string(),
        photo: z.string(),
        text: z.string(),
        tips: z.array(z.string()).optional(),
      }),
    ),
  }),
  marketplace: z.object({
    ...sectionHeadSchema,
    photo: z.string(),
    steps: z.array(z.object({ title: z.string(), text: z.string() })),
  }),
  propose: z.object({ ...sectionHeadSchema, items: z.array(cardSchema) }),
  rules: z.object({ ...sectionHeadSchema, items: z.array(cardSchema) }),
  topicsWall: z.object(sectionHeadSchema),
  faq: z.object({
    ...sectionHeadSchema,
    items: z.array(z.object({ q: z.string(), a: z.string() })),
  }),
  cta: z.object({
    title: z.string(),
    text: z.string(),
    primary: ctaSchema,
    secondary: ctaSchema,
  }),
});

export const associationSchema = z.object({
  meta: metaSchema,
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    lead: z.string(),
    photo: z.string(),
  }),
  mission: z.object({ ...sectionHeadSchema, items: z.array(cardSchema) }),
  principles: z.object({ ...sectionHeadSchema, items: z.array(cardSchema) }),
  timeline: z.object({
    ...sectionHeadSchema,
    items: z.array(
      z.object({ year: z.string(), title: z.string(), text: z.string() }),
    ),
  }),
  contribute: z.object({ ...sectionHeadSchema, items: z.array(cardSchema) }),
  contact: z.object({
    eyebrow: z.string().optional(),
    title: z.string(),
    text: z.string(),
  }),
});

/** The hero figures that the page computes from the events, by key. */
const socratesFactSchema = z
  .object({
    key: z.enum(["editions", "partners"]).optional(),
    value: z.string().optional(),
    label: z.string(),
  })
  .refine((f) => f.key !== undefined || f.value !== undefined, {
    message: "a fact needs a key or a value",
  });

/**
 * content/socrates.json. City, venue, dates, participants and partners of an
 * edition come from the linked event of content/events.json, so the file keeps
 * only what events do not have.
 */
export const socratesSchema = z.object({
  meta: metaSchema,
  hero: z.object({
    eyebrow: z.string(),
    status: z.string(),
    title: z.string(),
    lead: z.string(),
    photo: z.string().optional(),
    primary: ctaSchema,
    secondary: ctaSchema,
    facts: z.array(socratesFactSchema),
  }),
  about: z.object({
    ...sectionHeadSchema,
    lead: z.string(),
    pillars: z.array(cardSchema),
  }),
  openspace: z.object({
    ...sectionHeadSchema,
    lead: z.string(),
    laws: z.array(z.object({ title: z.string(), text: z.string() })),
    formats: z.object({ title: z.string(), items: z.array(cardSchema) }),
  }),
  schedule: z.object({
    ...sectionHeadSchema,
    days: z.array(
      z.object({ day: z.string(), title: z.string(), text: z.string() }),
    ),
    note: z.string(),
  }),
  editions: z.object({
    ...sectionHeadSchema,
    items: z.array(
      z.object({
        /** `Event.id` of an event of type socrates. */
        event: z.string(),
        /** Photo name; absent: the cover shows the year. */
        photo: z.string().min(1).optional(),
        text: z.string(),
      }),
    ),
  }),
  family: z.object({
    ...sectionHeadSchema,
    text: z.string(),
    items: z.array(
      z.object({ id: z.string(), name: z.string(), country: z.string() }),
    ),
  }),
  values: z.object({ ...sectionHeadSchema, items: z.array(cardSchema) }),
  sponsorsWall: z.object(sectionHeadSchema),
});

const ARTICLE_KINDS = ["Annonce", "Récap"] as const;

const articleSchema = z.object({
  /** Lower-case ASCII words joined by single hyphens: a safe URL segment. */
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "expected lower-case letters and digits joined by single hyphens",
    ),
  date: dateOrMonthSchema,
  kind: z.enum(ARTICLE_KINDS),
  title: z.string(),
  cover: z.string().optional(),
  excerpt: z.string(),
  tags: z.array(z.string()).optional(),
  body: z.string(),
  event: z.string().optional(),
});

export const articlesSchema = z.object({
  meta: metaSchema,
  eyebrow: z.string(),
  title: z.string(),
  lead: z.string(),
  items: z
    .array(articleSchema)
    .min(1)
    .superRefine((items, ctx) => {
      const seen = new Set<string>();
      items.forEach((item, index) => {
        if (seen.has(item.slug)) {
          ctx.addIssue({
            code: "custom",
            path: [index, "slug"],
            message: `duplicate slug "${item.slug}"`,
          });
        }
        seen.add(item.slug);
      });
    }),
});
