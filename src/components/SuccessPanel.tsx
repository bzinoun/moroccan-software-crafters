"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { PostIt } from "@/components/PostIt";
import { frenchSpacing } from "@/lib/french";

// Shown in place of a lead form once the request is sent.
// A status region named by its title. It takes focus (tabIndex -1) when it
// appears, so a screen reader reads it. Ids derive from `id`.

const TITLE = "Demande bien reçue.";

type SuccessPanelProps = {
  /** Id of the panel. The title gets `<id>-title`, the text `<id>-text`. */
  id: string;
  hidden: boolean;
  /** The words on the green post-it. */
  stamp: string;
  text: string;
  /** Level of the title, 2 by default. */
  headingLevel?: 2 | 3;
  /**
   * `ink` keeps the title in the color of the panel when the panel sits in a
   * dark section, whose rule would turn every heading white. The doubled
   * selector beats that rule without the important modifier.
   */
  tone?: "default" | "ink";
  /** After the text: for example a link. */
  children?: ReactNode;
};

export function SuccessPanel({
  id,
  hidden,
  stamp,
  text,
  headingLevel = 2,
  tone = "default",
  children,
}: SuccessPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const Heading = headingLevel === 3 ? "h3" : "h2";

  useEffect(() => {
    if (!hidden) ref.current?.focus();
  }, [hidden]);

  return (
    <div
      id={id}
      ref={ref}
      role="status"
      aria-labelledby={`${id}-title`}
      hidden={hidden}
      tabIndex={-1}
      className="px-2 py-6 text-center"
    >
      <PostIt
        color="green"
        className="mx-auto mb-6 w-[200px] -rotate-3 text-s150"
      >
        {stamp}
      </PostIt>
      <Heading
        id={`${id}-title`}
        className={tone === "ink" ? "[&&]:text-ink" : undefined}
      >
        {TITLE}
      </Heading>
      <p id={`${id}-text`} className="mx-auto max-w-[46ch] text-ink-soft">
        {frenchSpacing(text)}
      </p>
      {children}
    </div>
  );
}
