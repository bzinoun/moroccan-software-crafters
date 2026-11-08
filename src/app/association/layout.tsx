import type { ReactNode } from "react";
import { frauncesItalic } from "../fonts-italic";
import { PageFrame } from "../PageFrame";

export default function AssociationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PageFrame page="association" className={frauncesItalic.variable}>
      {children}
    </PageFrame>
  );
}
