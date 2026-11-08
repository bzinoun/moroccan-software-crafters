import type { ReactNode } from "react";
import { frauncesItalic } from "../fonts-italic";
import { PageFrame } from "../PageFrame";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <PageFrame page="home" className={frauncesItalic.variable}>
      {children}
    </PageFrame>
  );
}
