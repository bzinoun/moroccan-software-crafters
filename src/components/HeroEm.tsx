import { Fragment } from "react";
import { frenchSpacing } from "@/lib/french";

// Renders a JSON title that may contain `<em>…</em>` (the red emphasized word)
// as React elements, without dangerouslySetInnerHTML.
export function HeroEm({ text }: { text: string }) {
  const parts = text.split(/<em>(.*?)<\/em>/);
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <em key={index}>{frenchSpacing(part)}</em>
        ) : (
          <Fragment key={index}>{frenchSpacing(part)}</Fragment>
        ),
      )}
    </>
  );
}
