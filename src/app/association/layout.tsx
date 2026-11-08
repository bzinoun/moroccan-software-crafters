import type { ReactNode } from "react";
import { PageFrame } from "../PageFrame";

export default function AssociationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <PageFrame page="association">{children}</PageFrame>;
}
