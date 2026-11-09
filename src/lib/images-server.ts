import "server-only";

// Checks the public image files with node:fs. Call it from page code at build
// time, so a renamed photo fails the build instead of giving a broken share image.

import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolved from this module, like the content loaders.
const meetupsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../public/assets/img/meetups",
);

/** The photo name, or an error that names it when `<name>.jpg` is missing. */
export function requireMeetupPhoto(name: string): string {
  if (!existsSync(path.join(meetupsDir, `${name}.jpg`))) {
    throw new Error(
      `No image file public/assets/img/meetups/${name}.jpg for the photo "${name}"`,
    );
  }
  return name;
}
