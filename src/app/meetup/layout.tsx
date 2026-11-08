import type { ReactNode } from "react";
import { frauncesItalic } from "../fonts-italic";
import { PageFrame } from "../PageFrame";

export default function MeetupLayout({ children }: { children: ReactNode }) {
  return (
    <PageFrame page="meetup" className={frauncesItalic.variable}>
      {children}
    </PageFrame>
  );
}
