import { Button } from "@/components/Button";
import { TOTAL_STEPS } from "@/lib/funnel-fields";
import { nextLabel } from "@/lib/funnel-text";

// Retour (ghost, absent on step 1) and the primary button pushed right. Below
// `sm` the buttons stack at full width. The primary button submits the form, so
// the Enter key in a field acts like a click; the form handler does the work.
// While busy the button is marked aria-disabled, not disabled, so it keeps the
// focus; the form handler ignores the submit. With no script the form cannot
// move or send, so the whole bar is gone (`NoScriptNote` replaces it).

type FunnelNavProps = {
  step: number;
  busy: boolean;
  onPrev: () => void;
};

export function FunnelNav({ step, busy, onPrev }: FunnelNavProps) {
  return (
    <div className="mt-6.5 flex flex-col gap-3 border-t border-line pt-5.5 not-js:hidden sm:flex-row sm:justify-between">
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
        className="w-full whitespace-nowrap sm:ml-auto sm:w-auto"
      >
        {nextLabel(Math.min(step, TOTAL_STEPS), busy)}
      </Button>
    </div>
  );
}
