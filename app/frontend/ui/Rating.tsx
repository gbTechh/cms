import React from "react";
import { cn } from "./cn";

export interface RatingProps extends React.ComponentProps<"span"> {
  value: unknown;
  max?: number;
}

/** ★★★★☆ a partir de un número (campo `number` 1-5 típicamente). */
export function Rating({ value, max = 5, className, ...props }: RatingProps) {
  const filled = Math.max(0, Math.min(max, Number(value) || 0));
  return (
    <span className={cn("text-[1.3rem] tracking-widest text-pub-accent", className)} {...props}>
      {"★".repeat(filled)}
      {"☆".repeat(max - filled)}
    </span>
  );
}
