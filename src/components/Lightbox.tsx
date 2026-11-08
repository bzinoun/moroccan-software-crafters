"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import { Photo } from "./Photo";

// Spec: the "Lightbox, LightboxProvider, useLightbox" entry in msca-design/COMPONENTS.md.
// One native dialog is rendered once by the provider; the gallery, the feature
// cards and the articles call `useLightbox().open(items, startIndex)`.

export type LightboxItem = {
  /** Final URL of the photo, already built with `assetUrl()` by the caller. */
  src: string;
  caption?: string;
};

type LightboxApi = {
  open: (items: LightboxItem[], startIndex: number) => void;
};

type Session = { items: LightboxItem[]; index: number };

const LightboxContext = createContext<LightboxApi | null>(null);

export function useLightbox(): LightboxApi {
  const api = useContext(LightboxContext);
  if (api === null) {
    throw new Error("useLightbox must be used inside LightboxProvider");
  }
  return api;
}

// Round translucent button. Previous and next sit at the vertical middle of
// the screen edges; the close button is at the top right.
const roundButton =
  "absolute size-12 cursor-pointer rounded-full bg-white/12 text-2xl text-white hover:bg-white/25";

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const isOpen = session !== null;

  const open = useCallback((items: LightboxItem[], startIndex: number) => {
    const dialog = dialogRef.current;
    if (!dialog || items.length === 0) return;
    const start = Math.min(Math.max(startIndex, 0), items.length - 1);
    if (!dialog.open) {
      openerRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      dialog.showModal();
    }
    setSession({ items, index: start });
    closeRef.current?.focus();
  }, []);

  const api = useMemo(() => ({ open }), [open]);

  // Lock the page scroll while the dialog is open.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const step = useCallback((direction: number) => {
    setSession((current) => {
      if (current === null) return current;
      const count = current.items.length;
      return {
        ...current,
        index: (current.index + direction + count) % count,
      };
    });
  }, []);

  // A document-level listener: a click on the photo, the caption or the padding
  // moves focus to the page, out of the dialog, and a handler on the dialog
  // would stop receiving the arrow keys.
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, step]);

  // Runs for every way of closing: Escape (native), the close button and the
  // backdrop click all end in the native "close" event.
  function handleClose() {
    setSession(null);
    const opener = openerRef.current;
    openerRef.current = null;
    if (opener?.isConnected) opener.focus();
  }

  // The dialog fills the screen, so a click whose target is the dialog itself
  // landed outside the photo, the caption and the buttons.
  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) event.currentTarget.close();
  }

  const item = session ? session.items[session.index] : null;
  const count = session ? session.items.length : 0;
  const several = count > 1;
  const caption = frenchSpacing(item?.caption ?? "");
  const counter = session && several ? `${session.index + 1} / ${count}` : "";
  const figcaption = [caption, counter].filter(Boolean).join(" · ");

  return (
    <LightboxContext value={api}>
      {children}
      <dialog
        ref={dialogRef}
        aria-label="Photo agrandie"
        className="m-0 size-full max-h-none max-w-none flex-col items-center justify-center bg-transparent px-4 py-10 text-white backdrop:bg-[rgba(15,13,12,0.94)] open:flex **:focus-visible:outline-sage"
        onClick={handleClick}
        onClose={handleClose}
      >
        <button
          ref={closeRef}
          type="button"
          aria-label="Fermer"
          className={cn(roundButton, "top-4 right-4")}
          onClick={() => dialogRef.current?.close()}
        >
          ×
        </button>
        {several && (
          <button
            type="button"
            aria-label="Photo précédente"
            className={cn(roundButton, "top-1/2 left-4 -translate-y-1/2")}
            onClick={() => step(-1)}
          >
            ‹
          </button>
        )}
        {item && (
          <figure className="m-0 flex max-h-full max-w-[min(1100px,100%)] flex-col items-center">
            <Photo
              src={item.src}
              alt={caption}
              className="max-h-[calc(100vh-140px)] w-auto rounded-[6px]"
            />
            {/* Polite live region: the text changes in place at each step, so a screen reader announces the new photo. */}
            <figcaption
              aria-live="polite"
              className="mt-3 text-center text-s92 text-[#e8e2d9]"
            >
              {figcaption}
            </figcaption>
          </figure>
        )}
        {several && (
          <button
            type="button"
            aria-label="Photo suivante"
            className={cn(roundButton, "top-1/2 right-4 -translate-y-1/2")}
            onClick={() => step(1)}
          >
            ›
          </button>
        )}
      </dialog>
    </LightboxContext>
  );
}
