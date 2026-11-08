// Motion preference, read at call time: call it from handlers and effects only.

/** `smooth` unless the person asked the system for reduced motion. */
export function scrollBehavior(): ScrollBehavior {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function")
    return "auto";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}
