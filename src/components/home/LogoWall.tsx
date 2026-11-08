import { useId } from "react";
import type { Sticker } from "@/content/types";
import type { LogoTile as LogoTileData } from "@/lib/derive";
import { cn, tv } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import { Monogram } from "../Monogram";
import { PageLink } from "../PageLink";
import { LogoImage } from "./LogoImage";

// Spec: the "LogoWall, LogoTile, LogoSticker, Monogram" entry in msca-design/COMPONENTS.md.
// The tiles come from `logoWallTiles()` in src/lib/derive.ts, already sorted.
// Fixed-width tiles in a centered wrapping row keep the last row centered.
// A tile is a link only when the company has a LinkedIn page. The sticker
// ("Votre logo ici ?") has the footprint of a tile and ends the wall.
// The compact wall (association page) has narrower tiles, a 64px logo box and
// a role line that only a screen reader reads.

// One style set for the wall, its tiles and its sticker; `compact` picks the sizes.
// The lift is a separate `translate` property, moved only when motion is allowed.
// A text size and its line height sit in one string on purpose: tailwind-merge
// drops a leading set before a later text size.
const logoWallStyles = tv({
  slots: {
    wall: "flex flex-wrap justify-center",
    tile: "group flex flex-col items-center rounded-card border border-line bg-white text-center text-ink no-underline hover:text-ink motion-safe:transition-[translate,box-shadow,border-color] motion-safe:duration-200 motion-safe:ease-standard",
    box: "relative mb-1 grid place-items-center",
    logo: "rounded-card border border-line bg-white object-contain p-1 opacity-92 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:transition-opacity motion-safe:duration-250",
    name: "font-semibold",
    role: "text-s74 leading-[1.3] text-muted",
    sticker:
      "flex -rotate-2 flex-col items-center justify-center rounded-[2px] bg-postit-yellow text-center text-ink no-underline shadow-postit hover:-rotate-[0.5deg] hover:text-ink hover:shadow-lift focus-visible:-rotate-[0.5deg] focus-visible:shadow-lift motion-safe:transition-[translate,rotate,box-shadow] motion-safe:duration-200 motion-safe:ease-standard motion-safe:hover:-translate-y-0.75 motion-safe:focus-visible:-translate-y-0.75",
    stickerTitle: "font-hand font-semibold",
    stickerText: "text-ink-soft",
    stickerCta:
      "font-hand font-semibold text-green-dark underline decoration-[1.5px] underline-offset-3",
  },
  variants: {
    compact: {
      false: {
        wall: "gap-3.5",
        tile: "w-42 gap-1.5 px-3 pt-4.5 pb-3.5",
        box: "size-23",
        logo: "size-21",
        name: "text-s88 leading-[1.25]",
        sticker: "w-42 gap-2 px-3.5 py-4.5",
        stickerTitle: "text-s170 leading-none",
        stickerText: "text-s80 leading-[1.35]",
        stickerCta: "text-s130 leading-[1.1]",
      },
      true: {
        wall: "gap-2.5",
        tile: "w-28 gap-1 px-2 pt-3 pb-2.5",
        box: "size-16",
        logo: "size-15",
        name: "text-s80 leading-[1.25]",
        role: "sr-only",
        sticker: "w-28 gap-1 px-2 py-3",
        stickerTitle: "text-s125 leading-none",
        stickerText: "text-[0.68rem] leading-[1.3]",
        stickerCta: "text-s105 leading-[1.1]",
      },
    },
  },
  defaultVariants: { compact: false },
});

const TILE_LINK =
  "hover:border-line-strong hover:shadow-lift focus-visible:border-line-strong focus-visible:shadow-lift motion-safe:hover:-translate-y-0.75 motion-safe:focus-visible:-translate-y-0.75";

const MONOGRAM_SIZE = { false: "lg", true: "md" } as const;

type LogoTileProps = {
  tile: LogoTileData;
  /** Narrow tile for the association wall: the role is read, not shown, and the logo is smaller. */
  compact?: boolean;
};

export function LogoTile({ tile, compact = false }: LogoTileProps) {
  const styles = logoWallStyles({ compact });
  const label = frenchSpacing(tile.label);
  const monogramSize = MONOGRAM_SIZE[`${compact}`];
  // The name is printed under the logo, so the logo itself carries no alt text.
  const content = (
    <>
      <span className={styles.box()}>
        {tile.logoSrc ? (
          <LogoImage
            src={tile.logoSrc}
            alt=""
            width={120}
            height={120}
            className={styles.logo()}
            fallback={<Monogram initials={tile.monogram} size={monogramSize} />}
          />
        ) : (
          <Monogram initials={tile.monogram} size={monogramSize} />
        )}
      </span>
      <span className={styles.name()}>{frenchSpacing(tile.name)}</span>
      {label ? <span className={styles.role()}>{label}</span> : null}
    </>
  );

  return tile.href ? (
    <PageLink className={cn(styles.tile(), TILE_LINK)} href={tile.href}>
      {content}
    </PageLink>
  ) : (
    <div className={styles.tile()}>{content}</div>
  );
}

type LogoStickerProps = { sticker: Sticker; compact?: boolean };

export function LogoSticker({ sticker, compact = false }: LogoStickerProps) {
  const id = useId();
  const styles = logoWallStyles({ compact });
  return (
    <PageLink
      className={styles.sticker()}
      href={sticker.href}
      aria-labelledby={`${id}-t ${id}-l`}
      aria-describedby={`${id}-d`}
    >
      <span id={`${id}-t`} className={styles.stickerTitle()}>
        {frenchSpacing(sticker.title)}
      </span>
      <span id={`${id}-d`} className={styles.stickerText()}>
        {frenchSpacing(sticker.text)}
      </span>
      <span className={styles.stickerCta()}>
        <span id={`${id}-l`}>{frenchSpacing(sticker.label)}</span>
        {"\u00a0"}
        <span aria-hidden="true">→</span>
      </span>
    </PageLink>
  );
}

type LogoWallProps = {
  tiles: LogoTileData[];
  /** `companies.sticker.host` or `.sponsor`; no sticker when absent. */
  sticker?: Sticker;
  id?: string;
  /** Association wall: narrower tiles, 10px gap, role line read but not shown. */
  compact?: boolean;
};

export function LogoWall({
  tiles,
  sticker,
  id,
  compact = false,
}: LogoWallProps) {
  if (tiles.length === 0 && !sticker) return null;
  return (
    <div id={id} className={logoWallStyles({ compact }).wall()}>
      {tiles.map((tile) => (
        <LogoTile key={tile.id} tile={tile} compact={compact} />
      ))}
      {sticker ? <LogoSticker sticker={sticker} compact={compact} /> : null}
    </div>
  );
}
