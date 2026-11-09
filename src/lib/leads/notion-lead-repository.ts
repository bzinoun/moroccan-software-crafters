// Notion adapter of the lead port: one new page in the Leads data source.
import { toNotionProperties } from "./lead";
import type { LeadRepository } from "./lead-repository";

export type NotionConfig = { token: string; dataSourceId: string };

const NOTION_VERSION = "2025-09-03";
const PAGES_URL = "https://api.notion.com/v1/pages";

const sleep = (ms: number) => new Promise<void>((done) => setTimeout(done, ms));

/** `fetchFn` and `wait` are parameters so a test passes in-memory ones. */
export function notionLeadRepository(
  config: NotionConfig,
  fetchFn: typeof fetch = (...args) => fetch(...args),
  wait: (ms: number) => Promise<void> = sleep,
): LeadRepository {
  return {
    async save(lead) {
      const request = () =>
        fetchFn(PAGES_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.token}`,
            "Notion-Version": NOTION_VERSION,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            parent: {
              type: "data_source_id",
              data_source_id: config.dataSourceId,
            },
            properties: toNotionProperties(lead),
          }),
        });
      let response = await request();
      // Notion rate-limits at about 3 requests per second: wait once, then retry.
      if (response.status === 429) {
        await wait(1000);
        response = await request();
      }
      if (!response.ok) throw new Error(`Notion answered ${response.status}`);
    },
  };
}
