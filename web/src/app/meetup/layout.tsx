import type { ReactNode } from "react";
import { PageFrame } from "../PageFrame";

export default function MeetupLayout({ children }: { children: ReactNode }) {
  return <PageFrame page="meetup">{children}</PageFrame>;
}
