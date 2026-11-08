import type { ComponentProps } from "react";

type HoneypotProps = Omit<ComponentProps<"input">, "type"> & {
  /** Label text, read by nobody: the box is concealed from assistive technology. */
  label?: string;
};

/**
 * The spam trap. A person never sees it or tabs into it; a bot fills it. The
 * form treats a filled value as a silent success. Named `website_hp` by
 * default. The set attributes come after the props, so a caller cannot
 * override them by accident.
 */
export function Honeypot({
  id = "website_hp",
  name = "website_hp",
  label = "Ne pas remplir",
  ...props
}: HoneypotProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute -left-[9999px] size-px overflow-hidden"
    >
      <label htmlFor={id}>{label}</label>
      <input
        {...props}
        type="text"
        id={id}
        name={name}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
