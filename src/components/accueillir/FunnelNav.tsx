import { Button } from "@/components/Button";
import { TOTAL_STEPS, nextLabel } from "@/lib/funnel";

// Port of `.funnel-nav`: Retour (ghost, hidden on step 1) and the primary
// button pushed right. Below `sm` the buttons stack at full width. The primary
// button submits the form, so the Enter key in a field acts like a click; the
// form handler does the work. While busy the button is marked aria-disabled,
// not disabled, so it keeps the focus; the form handler ignores the submit.

type FunnelNavProps = {
  step: number;
  busy: boolean;
  onPrev: () => void;
};

export function FunnelNav({ step, busy, onPrev }: FunnelNavProps) {
  return (
    <div className="mt-[26px] flex flex-col gap-3 border-t border-line pt-[22px] sm:flex-row sm:justify-between">
      <Button
        id="prev"
        variant="ghost"
        hidden={step === 1}
        onClick={onPrev}
        className="w-full border-line whitespace-nowrap sm:w-auto"
      >
        Retour
      </Button>
      <Button
        id="next"
        type="submit"
        aria-disabled={busy || undefined}
        className="w-full whitespace-nowrap aria-disabled:cursor-not-allowed aria-disabled:opacity-55 aria-disabled:hover:translate-y-0 sm:ml-auto sm:w-auto"
      >
        {nextLabel(Math.min(step, TOTAL_STEPS), busy)}
      </Button>
    </div>
  );
}
