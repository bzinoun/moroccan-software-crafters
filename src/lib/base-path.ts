/**
 * Validates the `NEXT_PUBLIC_BASE_PATH` value. Next.js and the links built
 * from it break silently when the slashes are wrong, so fail the build instead.
 */
export function parseBasePath(raw: string | undefined): string {
  if (raw === undefined || raw === "") return "";
  if (!raw.startsWith("/")) {
    throw new Error(
      `NEXT_PUBLIC_BASE_PATH must start with "/" (got "${raw}"). Example: "/moroccan-software-crafters".`,
    );
  }
  if (raw.endsWith("/")) {
    throw new Error(
      `NEXT_PUBLIC_BASE_PATH must not end with "/" (got "${raw}"). Example: "/moroccan-software-crafters".`,
    );
  }
  return raw;
}
