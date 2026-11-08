import { tv } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import { TOTAL_STEPS } from "@/lib/funnel-fields";
import { progressLabel } from "@/lib/funnel-text";

// Four bars, one more filled per step, and a polite live line that names the
// step. With no script every step shows at once, so both are gone.

// A bar is filled once its step is reached; the current one also carries
// `aria-current="step"`, which is how a test reads the state.
const bar = tv({
  base: "h-1.5 flex-1 rounded-full motion-safe:transition-colors motion-safe:duration-300",
  variants: { reached: { true: "bg-green", false: "bg-line" } },
});

export function FunnelProgress({ step }: { step: number }) {
  return (
    <>
      <div aria-hidden="true" className="mb-2 flex gap-1.5 not-js:hidden">
        {Array.from({ length: TOTAL_STEPS }, (_, index) => (
          <span
            key={index}
            aria-current={index === step - 1 ? "step" : undefined}
            className={bar({ reached: index < step })}
          />
        ))}
      </div>
      <p
        id="progress-label"
        aria-live="polite"
        className="mb-5.5 text-s82 text-muted not-js:hidden"
      >
        {frenchSpacing(progressLabel(step))}
      </p>
    </>
  );
}
