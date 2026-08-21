import React from "react";
import { cn } from "./cn";

export interface StatProps extends React.ComponentProps<"div"> {
  value: React.ReactNode;
  label: React.ReactNode;
}

export function Stat({ value, label, className, ...props }: StatProps) {
  return (
    <div className={cn("text-center", className)} {...props}>
      <p className="font-pub-display text-[3.2rem] leading-none font-bold text-pub-accent">{value}</p>
      <p className="mt-2 text-[1.3rem] text-pub-text-muted">{label}</p>
    </div>
  );
}
