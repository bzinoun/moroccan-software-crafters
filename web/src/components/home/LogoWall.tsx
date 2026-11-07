import Link from "next/link";
import { useId } from "react";
import type { Sticker } from "@/content/types";
import type { LogoTile as LogoTileData } from "@/lib/derive";
import { cn, tv } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import { toRoute } from "@/lib/routes";
import { Monogram } from "../Monogram";
import { LogoImage } from "./LogoImage";

// Spec: the "LogoWall, LogoTile, LogoSticker, Monogram" entry in msca-design/COMPONENTS.md.
// Ported from renderLogoWall and stickerTile of assets/js/cms.js. The tiles
// come from `logoWallTiles()` in src/lib/derive.ts, already sorted.
// Fixed-width tiles in a centered wrapping row keep the last row centered.
// A tile is a link only when the company has a LinkedIn page. The sticker
// ("Votre logo ici ?") has the footprint of a tile and ends the wall.

// The lift is a separate `translate` property, moved only when motion is allowed.
// The compact wall (association page) has narrower tiles, a 64px logo box and
// no role line.
const tileStyles = tv({
  base: "group flex flex-col items-center rounded-card border border-line bg-card text-center text-ink no-underline hover:text-ink motion-safe:transition-[translate,box-shadow,border-color] motion-safe:duration-200 motion-safe:ease-[ease]",
  variants: {
    compact: {
      false: "w-42 gap-1.5 px-3 pt-[18px] pb-3.5",
      true: "w-28 gap-1 px-2 pt-3 pb-2.5",
    },
  },
  defaultVariants: { compact: false },
});

const boxStyles = tv({
  base: "relative mb-1 grid place-items-center",
  variants: { compact: { false: "size-23", true: "size-16" } },
  defaultVariants: { compact: false },
});

const nameStyles = tv({
  base: "font-semibold",
  // The line height follows the size: tailwind-merge drops a leading set before a later text size.
  variants: {
    compact: {
      false: "text-[0.88rem] leading-[1.25]",
      true: "text-[0.8rem] leading-[1.25]",
    },
  },
  defaultVariants: { compact: false },
});

const TILE_LINK =
  "hover:border-[#d9cfbd] hover:shadow-lift focus-visible:border-[#d9cfbd] focus-visible:shadow-lift motion-safe:hover:-translate-y-0.75 motion-safe:focus-visible:-translate-y-0.75";

const logoStyles = tv({
  base: "rounded-[14px] border border-line bg-white object-contain p-1 opacity-92 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:transition-opacity motion-safe:duration-250",
  variants: { compact: { false: "size-21", true: "size-15" } },
  defaultVariants: { compact: false },
});

const stickerStyles = tv({
  slots: {
    base: "flex -rotate-2 flex-col items-center justify-center rounded-[2px] bg-postit-yellow text-center text-ink no-underline shadow-[0_10px_18px_rgba(0,0,0,0.12)] hover:-rotate-[0.5deg] hover:text-ink hover:shadow-lift focus-visible:-rotate-[0.5deg] focus-visible:shadow-lift motion-safe:transition-[translate,rotate,box-shadow] motion-safe:duration-200 motion-safe:ease-[ease] motion-safe:hover:-translate-y-0.75 motion-safe:focus-visible:-translate-y-0.75",
    title: "font-hand font-semibold",
    text: "text-ink-soft",
    cta: "font-hand font-semibold text-green-dark underline decoration-[1.5px] underline-offset-3",
  },
  variants: {
    compact: {
      false: {
        base: "w-42 gap-2 px-3.5 py-[18px]",
        title: "text-[1.7rem] leading-none",
        text: "text-[0.8rem] leading-[1.35]",
        cta: "text-[1.3rem] leading-[1.1]",
      },
      true: {
        base: "w-28 gap-1 px-2 py-3",
        title: "text-[1.25rem] leading-none",
        text: "text-[0.68rem] leading-[1.3]",
        cta: "text-[1.05rem] leading-[1.1]",
      },
    },
  },
  defaultVariants: { compact: false },
});

type LogoTileProps = {
  tile: LogoTileData;
  /** Narrow tile for the association wall: no role line, smaller logo. */
  compact?: boolean;
};

export function LogoTile({ tile, compact = false }: LogoTileProps) {
  const label = frenchSpacing(tile.label);
  const name = frenchSpacing(tile.name);
  const title = label ? `${tile.name} · ${tile.label}` : tile.name;
  const monogramSize = compact ? "md" : "lg";
  const content = (
    <>
      <span className={boxStyles({ compact })}>
        {tile.logoSrc ? (
          <LogoImage
            src={tile.logoSrc}
            alt={tile.name}
            loading="lazy"
            width={120}
            height={120}
            className={logoStyles({ compact })}
            fallback={<Monogram initials={tile.monogram} size={monogramSize} />}
          />
        ) : (
          <Monogram initials={tile.monogram} size={monogramSize} />
        )}
      </span>
      <span className={nameStyles({ compact })}>{name}</span>
      {label && !compact ? (
        <span className="text-[0.74rem] leading-[1.3] text-muted">{label}</span>
      ) : null}
    </>
  );

  return tile.href ? (
    <a
      className={cn(tileStyles({ compact }), TILE_LINK)}
      href={tile.href}
      target="_blank"
      rel="noopener"
      title={title}
    >
      {content}
    </a>
  ) : (
    <div className={tileStyles({ compact })} title={title}>
      {content}
    </div>
  );
}

type LogoStickerProps = { sticker: Sticker; compact?: boolean };

export function LogoSticker({ sticker, compact = false }: LogoStickerProps) {
  const id = useId();
  const styles = stickerStyles({ compact });
  return (
    <Link
      className={styles.base()}
      href={toRoute(sticker.href)}
      aria-labelledby={`${id}-t ${id}-l`}
      aria-describedby={`${id}-d`}
    >
      <span id={`${id}-t`} className={styles.title()}>
        {frenchSpacing(sticker.title)}
      </span>
      <span id={`${id}-d`} className={styles.text()}>
        {frenchSpacing(sticker.text)}
      </span>
      <span className={styles.cta()}>
        <span id={`${id}-l`}>{frenchSpacing(sticker.label)}</span>
        {" "}
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

type LogoWallProps = {
  tiles: LogoTileData[];
  /** `companies.sticker.host` or `.sponsor`; no sticker when absent. */
  sticker?: Sticker;
  id?: string;
  /** Association wall: narrower tiles, 10px gap, no role line. */
  compact?: boolean;
};

export function LogoWall({
  tiles,
  sticker,
  id,
  compact = false,
}: LogoWallProps) {
  return (
    <div
      id={id}
      className={cn(
        "flex flex-wrap justify-center",
        compact ? "gap-2.5" : "gap-3.5",
      )}
    >
      {tiles.map((tile) => (
        <LogoTile key={tile.id} tile={tile} compact={compact} />
      ))}
      {sticker ? <LogoSticker sticker={sticker} compact={compact} /> : null}
    </div>
  );
}
