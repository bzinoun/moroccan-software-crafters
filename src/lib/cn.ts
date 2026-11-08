import { clsx, type ClassValue } from "clsx";
import {
  createTV,
  extendTailwindMerge,
  type TWMergeConfig,
} from "tailwind-variants/config";

/**
 * Teaches tailwind-merge the custom token names declared in `@theme`
 * (globals.css), so `shadow-lift` conflicts with `shadow-md` and so on.
 * Keep this list in sync with the `--shadow-*`, `--radius-*` and
 * `--container-*` tokens.
 */
const twMergeConfig = {
  extend: {
    theme: {
      shadow: ["card", "lift"],
      radius: ["card"],
      container: ["wrap"],
    },
  },
} satisfies TWMergeConfig;

const merge = extendTailwindMerge(twMergeConfig);

export type { ClassValue };

export function cn(...inputs: ClassValue[]): string {
  return merge(clsx(inputs));
}

export const tv = createTV({ twMergeConfig });
