import React from "react";
import { cn } from "./cn";

export function Specs({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mb-8 flex gap-8 border-y border-pub-border py-6", className)} {...props} />;
}

export interface SpecProps {
  value: React.ReactNode;
  label: React.ReactNode;
}

export function Spec({ value, label }: SpecProps) {
  return (
    <div className="flex flex-col">
      <span className="text-[1.8rem] font-bold">{value}</span>
      <span className="text-[1.2rem] text-pub-text-muted">{label}</span>
    </div>
  );
}
