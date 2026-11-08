import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";
import { FieldError } from "./Field";

type ConsentCheckboxProps = Omit<
  ComponentProps<"input">,
  "type" | "children"
> & {
  /** The consent sentence. It cites Moroccan law 09-08 and the purpose of the form. */
  children: string;
  /** The message shown when the box is unchecked on submit. */
  error?: string;
};

/**
 * The consent line of a form: a 20px checkbox with a green accent beside the
 * sentence. The sentence differs per form, so the caller writes it. The
 * error sits under the line and describes the checkbox.
 */
export function ConsentCheckbox({
  children,
  error,
  className,
  id,
  ...props
}: ConsentCheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <div className={cn("mb-[18px]", className)}>
      <label className="grid grid-cols-[22px_1fr] items-start gap-[10px] text-[0.88rem] text-ink-soft">
        <input
          type="checkbox"
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className="mt-0.5 mr-0 mb-0 ml-0 size-5 accent-green"
          {...props}
        />
        <span>{frenchSpacing(children)}</span>
      </label>
      {error && errorId ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}
