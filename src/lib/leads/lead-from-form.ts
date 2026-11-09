// The path without JavaScript: a plain form post reaches the server as
// FormData. This rebuilds the payload the JavaScript path sends (see
// buildPayload in src/lib/forms.ts), so one validation (toLead) serves both.
import { normalizePhone } from "../validation";

const TYPES: Record<string, string> = {
  host: "Hébergement meetup",
  sponsor: "Sponsoring SoCraTes",
};

/** Control fields of the form: they steer the handler and are not stored. */
const CONTROL = new Set(["_type", "_source", "consent", "website_hp"]);

type Context = { offers: readonly { id: string; name: string }[] };

export function leadPayloadFromForm(
  form: FormData,
  { offers }: Context,
): Record<string, string> {
  const payload: Record<string, string> = {};
  for (const name of new Set(form.keys())) {
    if (CONTROL.has(name)) continue;
    // A checkbox group (equipements) sends one entry per checked box.
    payload[name] = form
      .getAll(name)
      .map(String)
      .filter((value) => value !== "")
      .join(", ");
  }
  payload.type = TYPES[String(form.get("_type") ?? "")] ?? "";
  payload.source = String(form.get("_source") ?? "");
  if (payload.formule) {
    const offer = offers.find((o) => o.id === payload.formule);
    if (offer) payload.formule = offer.name;
  }
  if (payload.telephone) payload.telephone = normalizePhone(payload.telephone);
  return payload;
}
