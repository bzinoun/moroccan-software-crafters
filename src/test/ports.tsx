import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { PortsProvider, type Ports } from "@/lib/ports";

/** `render` with some ports replaced, for example by in-memory adapters. */
export function renderWithPorts(
  ui: ReactElement,
  ports: Partial<Ports>,
  options?: Omit<RenderOptions, "wrapper">,
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <PortsProvider ports={ports}>{children}</PortsProvider>;
  }
  return render(ui, { ...options, wrapper: Wrapper });
}
