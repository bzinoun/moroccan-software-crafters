import type { SubmitDeps } from "@/lib/forms";

export type RecordedRequest = { url: string; init: RequestInit | undefined };

type Options = Partial<Omit<SubmitDeps, "fetch" | "assignLocation">> & {
  /** HTTP status of every answer. Default 200. */
  status?: number;
  /** When set, the request fails with this error, as a network error does. */
  networkError?: Error;
};

/**
 * The browser side of `submitForm`, in memory: `fetch` records each request and
 * answers a real `Response`; `assignLocation` records each navigation.
 */
export function inMemorySubmitDeps(options: Options = {}) {
  const requests: RecordedRequest[] = [];
  const navigations: string[] = [];
  const { status = 200, networkError, ...rest } = options;

  const fetchInMemory: typeof fetch = async (input, init) => {
    requests.push({ url: String(input), init });
    if (networkError) throw networkError;
    return new Response(null, { status });
  };

  const deps: SubmitDeps = {
    fetch: fetchInMemory,
    assignLocation: (url) => {
      navigations.push(url);
    },
    now: () => new Date("2026-11-07T10:20:30.000Z"),
    href: "https://example.test/page/",
    search: "",
    referrer: "",
    ...rest,
  };
  return { deps, requests, navigations };
}
