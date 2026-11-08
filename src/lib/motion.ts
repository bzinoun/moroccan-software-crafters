// Motion preference, read at call time: call it from handlers and effects only.

import { browserMotion, type MotionPreference } from "./ports/motion";

/** `smooth` unless the person asked the system for reduced motion. */
export function scrollBehavior(
  motion: MotionPreference = browserMotion,
): ScrollBehavior {
  return motion.prefersReducedMotion() ? "auto" : "smooth";
}
