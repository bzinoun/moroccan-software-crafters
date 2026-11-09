// Port for storing a lead. Production writes to Notion
// (notion-lead-repository.ts); tests use the in-memory adapter below.
import type { Lead } from "./lead";

export type LeadRepository = {
  save(lead: Lead): Promise<void>;
};

export type InMemoryLeadRepository = LeadRepository & { leads: Lead[] };

/** Keeps the saved leads in an array; `fail` makes every save reject. */
export function inMemoryLeadRepository(
  options: { fail?: boolean } = {},
): InMemoryLeadRepository {
  const leads: Lead[] = [];
  return {
    leads,
    async save(lead) {
      if (options.fail) throw new Error("in-memory failure");
      leads.push(lead);
    },
  };
}
