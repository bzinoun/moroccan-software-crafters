// POST /api/leads: both lead forms post here, with or without script. The
// logic lives in src/lib/leads/leads-handler.ts; this file only wires the
// server environment (Notion variables) and the offers for the form path.
import { loadOffers } from "@/content/load";
import { createLeadsHandler } from "@/lib/leads/leads-handler";
import { leadRepositoryFromEnv } from "@/lib/leads/save-lead";

const handle = createLeadsHandler({
  repository: () => leadRepositoryFromEnv(process.env),
  offers: () => loadOffers().items,
});

export async function POST(request: Request): Promise<Response> {
  return handle(request);
}
