import type { ReactNode } from "react";
import { PageFrame } from "../PageFrame";

export default function AccueillirLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PageFrame
      page="host"
      skip={{ href: "#funnel", label: "Aller au formulaire" }}
    >
      {children}
    </PageFrame>
  );
}
