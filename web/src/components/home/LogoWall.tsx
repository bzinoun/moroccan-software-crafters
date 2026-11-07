import Link from "next/link";
import { useId } from "react";
import type { Sticker } from "@/content/types";
import type { LogoTile as LogoTileData } from "@/lib/derive";
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
const TILE =
  "group flex w-42 flex-col items-center gap-1.5 rounded-card border border-line bg-card px-3 pt-[18px] pb-3.5 text-center text-ink no-underline hover:text-ink motion-safe:transition-[translate,box-shadow,border-color] motion-safe:duration-200 motion-safe:ease-[ease]";

const TILE_LINK =
  "hover:border-[#d9cfbd] hover:shadow-lift focus-visible:border-[#d9cfbd] focus-visible:shadow-lift motion-safe:hover:-translate-y-0.75 motion-safe:focus-visible:-translate-y-0.75";

const LOGO =
  "size-21 rounded-[14px] border border-line bg-white object-contain p-1 opacity-92 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:transition-opacity motion-safe:duration-250";

const STICKER =
  "flex w-42 -rotate-2 flex-col items-center justify-center gap-2 rounded-[2px] bg-postit-yellow px-3.5 py-[18px] text-center text-ink no-underline shadow-[0_10px_18px_rgba(0,0,0,0.12)] hover:-rotate-[0.5deg] hover:text-ink hover:shadow-lift focus-visible:-rotate-[0.5deg] focus-visible:shadow-lift motion-safe:transition-[translate,rotate,box-shadow] motion-safe:duration-200 motion-safe:ease-[ease] motion-safe:hover:-translate-y-0.75 motion-safe:focus-visible:-translate-y-0.75";

type LogoTileProps = { tile: LogoTileData };

export function LogoTile({ tile }: LogoTileProps) {
  const label = frenchSpacing(tile.label);
  const name = frenchSpacing(tile.name);
  const title = label ? `${tile.name} · ${tile.label}` : tile.name;
  const content = (
    <>
      <span className="relative mb-1 grid size-23 place-items-center">
        {tile.logoSrc ? (
          <LogoImage
            src={tile.logoSrc}
            alt={tile.name}
            loading="lazy"
            width={120}
            height={120}
            className={LOGO}
            fallback={<Monogram initials={tile.monogram} />}
          />
        ) : (
          <Monogram initials={tile.monogram} />
        )}
      </span>
      <span className="text-[0.88rem] leading-[1.25] font-semibold">
        {name}
      </span>
      {label ? (
        <span className="text-[0.74rem] leading-[1.3] text-muted">{label}</span>
      ) : null}
    </>
  );

  return tile.href ? (
    <a
      className={`${TILE} ${TILE_LINK}`}
      href={tile.href}
      target="_blank"
      rel="noopener"
      title={title}
    >
      {content}
    </a>
  ) : (
    <div className={TILE} title={title}>
      {content}
    </div>
  );
}

type LogoStickerProps = { sticker: Sticker };

export function LogoSticker({ sticker }: LogoStickerProps) {
  const id = useId();
  return (
    <Link
      className={STICKER}
      href={toRoute(sticker.href)}
      aria-labelledby={`${id}-t ${id}-l`}
      aria-describedby={`${id}-d`}
    >
      <span
        id={`${id}-t`}
        className="font-hand text-[1.7rem] leading-none font-semibold"
      >
        {frenchSpacing(sticker.title)}
      </span>
      <span
        id={`${id}-d`}
        className="text-[0.8rem] leading-[1.35] text-ink-soft"
      >
        {frenchSpacing(sticker.text)}
      </span>
      <span className="font-hand text-[1.3rem] leading-[1.1] font-semibold text-green-dark underline decoration-[1.5px] underline-offset-3">
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
};

export function LogoWall({ tiles, sticker, id }: LogoWallProps) {
  return (
    <div id={id} className="flex flex-wrap justify-center gap-3.5">
      {tiles.map((tile) => (
        <LogoTile key={tile.id} tile={tile} />
      ))}
      {sticker ? <LogoSticker sticker={sticker} /> : null}
    </div>
  );
}
