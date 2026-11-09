// Typed loader for the root content/*.json files.
// The JSON files at the repo root stay the single source of truth.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import type { Home, Site } from "./types";

const navLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const ctaSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const siteSchema = z.object({
  name: z.string(),
  shortName: z.string(),
  tagline: z.string(),
  mission: z.string(),
  description: z.string(),
  baseUrl: z.string(),
  since: z.number(),
  linkedinFollowers: z.number(),
  links: z.object({ linkedin: z.string(), socrates: z.string(), github: z.string() }),
  contact: z.object({ email: z.string() }),
  form: z.object({ endpoint: z.string(), extraFields: z.record(z.string(), z.string()) }),
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
  }),
});

// Compile-time check: each schema and its hand-written type in types.ts describe one shape.
type Equal<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
type Check<T extends true> = T;
export type SiteSchemaMatchesType = Check<Equal<z.infer<typeof siteSchema>, Site>>;
export type HomeSchemaMatchesType = Check<Equal<z.infer<typeof homeSchema>, Home>>;

// Resolved from this module, so the same path works in Vitest and in `next build`.
const contentDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../content");

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

export function loadSite(): Site {
  return parseSite(readJson("site.json"), "content/site.json");
}

export function loadHome(): Home {
  return parseHome(readJson("home.json"), "content/home.json");
}
