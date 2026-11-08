// Field rules shared by the lead forms (host funnel and SoCraTes sponsor form).
// The patterns are the ones of the old site; the callers own the messages.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** True for `name@domain.tld`. The caller trims the value first. */
export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

/** The phone number without spaces, dots, dashes and brackets. */
export function normalizePhone(value: string): string {
  return value.replace(/[\s.\-()]/g, "");
}

/** Moroccan `05`, `06` or `07` plus 8 digits, or international `+` or `00` plus 8 to 15 digits. */
export function validPhone(value: string): boolean {
  const phone = normalizePhone(value);
  return /^0[5-7]\d{8}$/.test(phone) || /^(\+|00)\d{8,15}$/.test(phone);
}
