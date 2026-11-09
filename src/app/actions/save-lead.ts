"use server";

// Server Action of both lead forms. The Notion token stays on the server:
// NOTION_TOKEN and NOTION_LEADS_DATA_SOURCE_ID come from the Vercel project
// environment. Without them every call fails and the form shows its fallback.
import { createSaveLead, leadRepositoryFromEnv } from "@/lib/leads/save-lead";

const save = createSaveLead(() => leadRepositoryFromEnv(process.env));

export async function saveLead(payload: unknown): Promise<void> {
  await save(payload);
}
