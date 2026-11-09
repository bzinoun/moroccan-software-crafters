// Use case behind the saveLead Server Action: validate the payload, then store
// it through the lead port. The repository comes from a factory so tests pass
// the in-memory adapter and production reads the server environment.
import { toLead } from "./lead";
import type { LeadRepository } from "./lead-repository";
import { notionLeadRepository } from "./notion-lead-repository";

export function createSaveLead(repository: () => LeadRepository | null) {
  return async function saveLead(payload: unknown): Promise<void> {
    const result = toLead(payload);
    // No personal data in the error: the message reaches the logs.
    if (!result.ok) throw new Error("Invalid lead");
    const target = repository();
    if (!target) throw new Error("Lead storage is not configured");
    await target.save(result.lead);
  };
}

type LeadEnv = {
  NOTION_TOKEN?: string;
  NOTION_LEADS_DATA_SOURCE_ID?: string;
  [name: string]: string | undefined;
};

/** The Notion repository when both server variables are set, else null. */
export function leadRepositoryFromEnv(env: LeadEnv): LeadRepository | null {
  const token = env.NOTION_TOKEN;
  const dataSourceId = env.NOTION_LEADS_DATA_SOURCE_ID;
  if (!token || !dataSourceId) return null;
  return notionLeadRepository({ token, dataSourceId });
}
