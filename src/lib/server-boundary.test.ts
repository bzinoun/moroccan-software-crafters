import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const srcDir = path.resolve(__dirname, "..");

/** Source file of a local import ("./x" or "@/x"), or undefined for a package. */
function localFile(from: string, specifier: string): string | undefined {
  const base = specifier.startsWith("@/")
    ? path.join(srcDir, specifier.slice(2))
    : specifier.startsWith(".")
      ? path.resolve(path.dirname(from), specifier)
      : undefined;
  if (base === undefined) return undefined;
  return [`${base}.ts`, `${base}.tsx`].find(existsSync);
}

/** Every module specifier that a file and its local imports pull in. */
function importedSpecifiers(file: string, seen = new Set<string>()): string[] {
  if (seen.has(file)) return [];
  seen.add(file);
  const source = readFileSync(file, "utf8");
  const specifiers = [
    ...source.matchAll(/^(?:import|export)\s[^;]*?from\s+"([^"]+)"/gm),
  ].map((m) => m[1] as string);
  return specifiers.flatMap((specifier) => {
    const next = localFile(file, specifier);
    return next ? [specifier, ...importedSpecifiers(next, seen)] : [specifier];
  });
}

describe("modules that client files import", () => {
  it.each(["lib/pages-data.ts", "lib/home-data.ts"])(
    "%s never reaches node:fs or the content loaders",
    (name) => {
      const reached = importedSpecifiers(path.join(srcDir, name)).filter(
        (s) => s.startsWith("node:") || s === "@/content/load",
      );
      expect(reached).toEqual([]);
    },
  );
});

describe("modules that read files", () => {
  it.each([
    "content/load.ts",
    "lib/articles-server.ts",
    "lib/images-server.ts",
    "lib/page-metadata.ts",
  ])('%s imports "server-only", so a client import fails the build', (name) => {
    const source = readFileSync(path.join(srcDir, name), "utf8");
    expect(source).toMatch(/^import "server-only";$/m);
  });
});
