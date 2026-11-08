"use client";

import type { ComponentProps } from "react";
import { Button } from "../Button";
import { choosePackage } from "./package-choice";

// The "Choisir ce niveau" button of a package. It is a link to the form, so it
// jumps there with no script; with script it also tells the sponsor form which
// package it stands for, and the form checks that level.

type ChooseLevelLinkProps = Pick<
  ComponentProps<typeof Button>,
  "variant" | "className"
> & {
  /** Id of the package of the card. */
  packageId: string;
  children: string;
};

export function ChooseLevelLink({
  packageId,
  variant,
  className,
  children,
}: ChooseLevelLinkProps) {
  return (
    <Button
      variant={variant}
      href="#sponsor-form"
      onClick={() => choosePackage(packageId)}
      className={className}
    >
      {children}
    </Button>
  );
}
