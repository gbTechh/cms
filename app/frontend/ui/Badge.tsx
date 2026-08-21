import React from "react";
import { cn } from "./cn";

export interface BadgeProps extends React.ComponentProps<"span"> {
  /** pill (default, para cards) · outline (para el header de un detalle) */
  variant?: "pill" | "outline";
}

export function Badge({ variant = "pill", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block w-fit rounded-full px-3 py-1 text-[1.1rem] font-semibold tracking-wide text-pub-accent uppercase",
        variant === "pill" ? "bg-pub-accent/10" : "border border-pub-accent/30",
        className
      )}
      {...props}
    />
  );
}
