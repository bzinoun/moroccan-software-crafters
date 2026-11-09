"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { systemClock, type Clock } from "./clock";
import { consoleReporter, type ErrorReporter } from "./error-reporter";
import { browserImageProbe, type ImageProbe } from "./image-probe";
import { browserStorage, type KeyValueStore } from "./key-value-store";
import { browserModalDialog, type ModalDialog } from "./modal-dialog";
import { browserMotion, type MotionPreference } from "./motion";
import { browserScroller, type Scroller } from "./scroller";
import { browserViewport, type Viewport } from "./viewport";

// The side effects of the client components, each behind a small interface.
// A component reads its ports with `usePorts()`. With no provider above it, the
// real browser adapters answer, so the app needs no set-up. A test wraps the
// tree in `PortsProvider` with in-memory adapters (`src/test/`).

export type Ports = {
  clock: Clock;
  storage: KeyValueStore;
  errorReporter: ErrorReporter;
  motion: MotionPreference;
  scroller: Scroller;
  viewport: Viewport;
  imageProbe: ImageProbe;
  modalDialog: ModalDialog;
};

export const browserPorts: Ports = {
  clock: systemClock,
  storage: browserStorage,
  errorReporter: consoleReporter,
  motion: browserMotion,
  scroller: browserScroller,
  viewport: browserViewport,
  imageProbe: browserImageProbe,
  modalDialog: browserModalDialog,
};

const PortsContext = createContext<Ports>(browserPorts);

/** Replaces some ports for the tree below; the others come from the parent. */
export function PortsProvider({
  ports,
  children,
}: {
  ports: Partial<Ports>;
  children: ReactNode;
}) {
  const parent = useContext(PortsContext);
  const value = useMemo(() => ({ ...parent, ...ports }), [parent, ports]);
  return (
    <PortsContext.Provider value={value}>{children}</PortsContext.Provider>
  );
}

export function usePorts(): Ports {
  return useContext(PortsContext);
}

export type { Clock, ErrorReporter, ImageProbe, KeyValueStore, ModalDialog };
export type { MotionPreference, Scroller, Viewport };
