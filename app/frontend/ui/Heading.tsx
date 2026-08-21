import React from "react";
import { cn } from "./cn";

type HeadingTag = "h1" | "h2" | "h3" | "h4";

export interface HeadingProps extends Omit<React.ComponentProps<"h1">, "children"> {
  as?: HeadingTag;
  /** Tamaño visual, independiente del tag semántico (as). */
  size?: "sm" | "md" | "lg" | "xl";
  children?: React.ReactNode;
}

const SIZE_CLASS: Record<NonNullable<HeadingProps["size"]>, string> = {
  sm: "text-[1.8rem]",
  md: "text-[2.4rem]",
  lg: "text-[3rem]",
  xl: "text-[4.4rem] leading-[1.1]",
};

/** Todos los títulos del sitio usan la tipografía display del tema activo (Fraunces en "dental"). */
export function Heading({ as: Tag = "h2", size = "md", className, ...props }: HeadingProps) {
  return (
    <Tag
      className={cn("font-pub-display font-bold tracking-tight text-pub-text", SIZE_CLASS[size], className)}
      {...props}
    />
  );
}
