import type { ReactNode } from "react";
import { frenchSpacing } from "@/lib/french";

// Port of `.step`: a fieldset with a legend, hidden unless it is the current
// step. The legend takes focus by script when the step changes. The title is a
// real level 2 heading inside the legend, so the page has an h2 per step. The
// heading keeps the line height and spacing of the old legend text. Preflight
// already resets the margin, padding and border of a fieldset and a legend.

/** The grey sentence under a legend (or under the recap on the last step). */
export function StepHint({ children }: { children: string }) {
  return (
    <p className="mb-[22px] text-[0.93rem] text-muted">
      {frenchSpacing(children)}
    </p>
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
  return (
    <fieldset data-step={step} hidden={!active} className="min-w-0">
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
