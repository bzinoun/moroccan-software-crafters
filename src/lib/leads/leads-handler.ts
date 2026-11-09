// POST /api/leads. A fixed URL, so a page opened before a deploy can still
// send (a Server Action id changes with every build). Two bodies:
// - JSON from the forms with JavaScript: answers 200, 400, 503 or 502;
// - a plain form post without JavaScript: redirects (303) to the thank-you
//   page or to the error page.
import { leadPayloadFromForm } from "./lead-from-form";
import type { LeadRepository } from "./lead-repository";
import {
  createSaveLead,
  InvalidLeadError,
  StorageNotConfiguredError,
} from "./save-lead";

type Deps = {
  repository: () => LeadRepository | null;
  offers: () => readonly { id: string; name: string }[];
};

const THANKS = "/merci/";
const FAILED = "/envoi-impossible/";

export function createLeadsHandler({ repository, offers }: Deps) {
  const saveLead = createSaveLead(repository);

  async function save(payload: unknown): Promise<number> {
    try {
      await saveLead(payload);
      return 200;
    } catch (error) {
      if (error instanceof InvalidLeadError) return 400;
      if (error instanceof StorageNotConfiguredError) return 503;
      // The message holds no personal data (see save-lead.ts).
      console.error(error);
      return 502;
    }
  }

  return async function handle(request: Request): Promise<Response> {
    const type = request.headers.get("content-type") ?? "";
    if (type.includes("application/json")) {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return Response.json({ ok: false }, { status: 400 });
      }
      const status = await save(body);
      return Response.json({ ok: status === 200 }, { status });
    }

    const form = await request.formData();
    const goTo = (path: string) =>
      Response.redirect(new URL(path, request.url), 303);
    // Robot caught: thank it and store nothing, like the JavaScript path.
    if (String(form.get("website_hp") ?? "") !== "") return goTo(THANKS);
    if (form.get("consent") !== "on") return goTo(FAILED);
    const status = await save(leadPayloadFromForm(form, { offers: offers() }));
    return goTo(status === 200 ? THANKS : FAILED);
  };
}
