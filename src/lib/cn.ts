import { clsx, type ClassValue } from "clsx";
import {
  createTV,
  extendTailwindMerge,
  type TWMergeConfig,
} from "tailwind-variants/config";

/**
 * Teaches tailwind-merge the custom token names declared in `@theme`
 * (globals.css), so `shadow-lift` conflicts with `shadow-md` and so on. A
 * custom text size needs it most: without its name, tailwind-merge reads
 * `text-s95` as a text color and drops a color or a size that sits next to it.
 * `cn.test.ts` reads globals.css and fails when a `--text-*`, `--shadow-*`,
 * `--radius-*`, `--container-*`, `--ease-*` or `--font-*` token is missing here.
 */
export const twMergeConfig = {
  extend: {
    theme: {
      text: [
        "s72",
        "s74",
        "s76",
        "s78",
        "s80",
        "s82",
        "s84",
        "s85",
        "s88",
        "s90",
        "s92",
        "s93",
        "s95",
        "s98",
        "s102",
        "s105",
        "s115",
        "s120",
        "s125",
        "s130",
        "s135",
        "s140",
        "s150",
        "s160",
        "s170",
        "s180",
        "s190",
      ],
      shadow: ["card", "lift", "postit"],
      radius: ["card", "sm"],
      container: ["wrap"],
      ease: ["standard"],
      font: ["display", "body", "hand"],
    },
  },
} satisfies TWMergeConfig;

const merge = extendTailwindMerge(twMergeConfig);

export type { ClassValue };

export function cn(...inputs: ClassValue[]): string {
  return merge(clsx(inputs));
}

export const tv = createTV({ twMergeConfig });
