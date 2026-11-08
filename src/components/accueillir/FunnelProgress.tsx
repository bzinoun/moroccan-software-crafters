import { frenchSpacing } from "@/lib/french";
import { TOTAL_STEPS, progressLabel } from "@/lib/funnel";

// Port of `.progress` and `.progress-label`: four bars, one more filled per
// step, and a polite live line that names the step.

export function FunnelProgress({ step }: { step: number }) {
  return (
    <>
      <div aria-hidden="true" className="mb-2 flex gap-1.5">
        {Array.from({ length: TOTAL_STEPS }, (_, index) => {
          const done = index < step;
          return (
            <span
              key={index}
              data-done={done ? "" : undefined}
              className={
                done
                  ? "h-1.5 flex-1 rounded-full bg-green motion-safe:transition-colors motion-safe:duration-300"
                  : "h-1.5 flex-1 rounded-full bg-line motion-safe:transition-colors motion-safe:duration-300"
              }
            />
          );
        })}
      </div>
      <p
        id="progress-label"
        aria-live="polite"
        className="mb-[22px] text-[0.82rem] text-muted"
      >
        {frenchSpacing(progressLabel(step))}
      </p>
    </>
  );
}
