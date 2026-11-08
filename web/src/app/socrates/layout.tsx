import type { ReactNode } from "react";
import { PageFrame } from "../PageFrame";

export default function SocratesLayout({ children }: { children: ReactNode }) {
  return <PageFrame page="socrates">{children}</PageFrame>;
}
