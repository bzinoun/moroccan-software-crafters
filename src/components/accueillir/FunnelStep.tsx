import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import { useHydrated } from "./useHydrated";

// One step of the funnel: a fieldset with a legend. The legend takes focus by
// script when the step changes. The title is a real level 2 heading inside the
// legend, so the page has an h2 per step. Preflight already resets the margin
// and padding of a fieldset and a legend, and the edge of the fieldset.
//
// Only a visitor with script has steps to move through. The exported HTML shows
// every step, and the `js` variant hides the ones that are not current from the
// first paint. Once hydrated, the HTML attribute that conceals a step takes over
// from the class, so a step also stays concealed if the script that sets `js`
// was blocked.

/** The grey sentence under a legend (or under the recap on the last step). */
export function StepHint({ children }: { children: string }) {
  return (
    <p className="mb-5.5 text-s93 text-muted">{frenchSpacing(children)}</p>
  );
}

type FunnelStepProps = {
  step: number;
  active: boolean;
  title: string;
  hint?: string;
  children: ReactNode;
};

export function FunnelStep({
  step,
  active,
  title,
  hint,
  children,
}: FunnelStepProps) {
  const hydrated = useHydrated();
  return (
    <fieldset
      data-step={step}
      hidden={hydrated && !active}
      className={cn("min-w-0", !active && "js:hidden")}
    >
      <legend id={`step-${step}-legend`} tabIndex={-1} className="mb-[0.3rem]">
        <h2 className="m-0 text-[1.55rem] [line-height:inherit] [letter-spacing:inherit]">
          {frenchSpacing(title)}
        </h2>
      </legend>
      {hint ? <StepHint>{hint}</StepHint> : null}
      {children}
    </fieldset>
  );
}
