import React from "react";
import { cn } from "./cn";

type TextTag = "p" | "span" | "div";

export interface TextProps extends Omit<React.ComponentProps<"p">, "children"> {
  as?: TextTag;
  /** body: texto normal · muted: gris secundario · small: nota chica */
  variant?: "body" | "muted" | "small";
  children?: React.ReactNode;
}

const VARIANT_CLASS: Record<NonNullable<TextProps["variant"]>, string> = {
  body: "text-base leading-relaxed text-pub-text",
  muted: "text-md leading-relaxed text-pub-text-muted",
  small: "text-xs text-pub-text-muted",
};

/** Texto base del sitio público. Cualquier className que pases pisa lo de acá (ver cn.ts). */
export function Text({ as: Tag = "p", variant = "body", className, ...props }: TextProps) {
  return <Tag className={cn(VARIANT_CLASS[variant], className)} {...props} />;
}
