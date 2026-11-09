import type { ReactNode } from "react";
import { frauncesItalic } from "../fonts-italic";
import { PageFrame } from "../PageFrame";

export default function SocratesLayout({ children }: { children: ReactNode }) {
  return (
    <PageFrame page="socrates" className={frauncesItalic.variable}>
      {children}
    </PageFrame>
  );
}
