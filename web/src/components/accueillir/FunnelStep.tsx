import type { ReactNode } from "react";
import { frenchSpacing } from "@/lib/french";

// Port of `.step`: a fieldset with a legend, hidden unless it is the current
// step. The legend takes focus by script when the step changes.

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
    <fieldset
      data-step={step}
      hidden={!active}
      className="m-0 min-w-0 border-0 p-0"
    >
      <legend
        id={`step-${step}-legend`}
        tabIndex={-1}
        className="mb-[0.3rem] p-0 font-display text-[1.55rem] font-semibold"
      >
        {frenchSpacing(title)}
      </legend>
      {hint ? <StepHint>{hint}</StepHint> : null}
      {children}
    </fieldset>
  );
}
