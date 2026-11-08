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
    <p id={id} className="mt-[5px] mb-[1em] text-[0.84rem] text-red">
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
  /** Text under the control. An empty string keeps the paragraph, empty. */
  help?: string;
  /** The message, shown when the field is invalid. An empty or missing value means valid. */
  error?: string;
  /**
   * The child is a group (`PillGroup`, `ChoiceGroup`): the label becomes a
   * span and the child points to it with `aria-labelledby`.
   */
  group?: boolean;
  className?: string;
  /**
   * One control. Field gives it `id`, `aria-invalid` and `aria-describedby`,
   * and keeps what the control already has: its `id`, an `aria-invalid` set to
   * true, and its own describedby ids, which stay first.
   */
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
  // An empty string still renders the paragraph: it keeps the margins it had in
  // the old form (the date help is empty until a date is picked).
  const helpId = help !== undefined ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const own = children.props;
  const controlId = own.id ?? id;
  const describedBy =
    [own["aria-describedby"], help ? helpId : undefined, errorId]
      .filter(Boolean)
      .join(" ") || undefined;
  const invalid = Boolean(error) || own["aria-invalid"] === true;
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
    id: controlId,
    "aria-invalid": invalid ? true : undefined,
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
          <label htmlFor={controlId} className={LABEL_CLASS}>
            {labelContent}
          </label>
        )
      ) : null}
      {control}
      {helpId ? (
        <p id={helpId} className="mt-[5px] mb-[1em] text-[0.83rem] text-muted">
          {help ? frenchSpacing(help) : null}
        </p>
      ) : null}
      {error && errorId ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}
