import type { ReactNode } from "react";
import { PageFrame } from "../PageFrame";

export default function NewsLayout({ children }: { children: ReactNode }) {
  return <PageFrame page="news">{children}</PageFrame>;
}
