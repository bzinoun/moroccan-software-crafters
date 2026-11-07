import { cloneElement, type ReactElement } from "react";
import { cn } from "@/lib/cn";
import { frenchSpacing } from "@/lib/french";

// Spec: the "Form primitives" entry in msca-design/COMPONENTS.md; port of
// `.field`, `.opt`, `.help` and `.error`.

type ControlProps = {
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
};

type FieldErrorProps = {
  id: string;
  children: string;
};

/** The red message under a control. Shown only when the field is invalid. */
export function FieldError({ id, children }: FieldErrorProps) {
  return (
    <p id={id} className="mt-[5px] mb-0 text-[0.84rem] text-red">
      {frenchSpacing(children)}
    </p>
  );
}

const LABEL_CLASS = "mb-1.5 block text-[0.93rem] font-semibold";

type FieldProps = {
  /** Id of the control (or of the group). Help and error ids derive from it. */
  id: string;
  /** Visible label. Leave it out when a legend names the field. */
  label?: string;
  /** `true` adds "(facultatif)"; a string adds that text instead. */
  optional?: boolean | string;
  help?: string;
  /** The message, shown when the field is invalid. An empty or missing value means valid. */
  error?: string;
  /**
   * The child is a group (`PillGroup`, `ChoiceGroup`): the label becomes a
   * span and the child points to it with `aria-labelledby`.
   */
  group?: boolean;
  className?: string;
  /** One control. Field gives it `id`, `aria-invalid` and `aria-describedby`. */
  children: ReactElement<ControlProps>;
};

export function Field({
  id,
  label,
  optional,
  help,
  error,
  group = false,
  className,
  children,
}: FieldProps) {
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;
  const suffix = optional === true ? "(facultatif)" : optional || undefined;
  const labelContent = label ? (
    <>
      {frenchSpacing(label)}
      {suffix ? (
        <>
          {" "}
          <span className="font-normal text-muted">
            {frenchSpacing(suffix)}
          </span>
        </>
      ) : null}
    </>
  ) : null;
  const control = cloneElement(children, {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    ...(group && label ? { "aria-labelledby": `${id}-label` } : {}),
  });
  return (
    <div className={cn("mb-[18px]", className)}>
      {labelContent ? (
        group ? (
          <span id={`${id}-label`} className={LABEL_CLASS}>
            {labelContent}
          </span>
        ) : (
          <label htmlFor={id} className={LABEL_CLASS}>
            {labelContent}
          </label>
        )
      ) : null}
      {control}
      {help && helpId ? (
        <p id={helpId} className="mt-[5px] mb-0 text-[0.83rem] text-muted">
          {frenchSpacing(help)}
        </p>
      ) : null}
      {error && errorId ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}
