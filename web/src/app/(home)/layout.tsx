import type { ReactNode } from "react";
import { PageFrame } from "../PageFrame";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return <PageFrame page="home">{children}</PageFrame>;
}
