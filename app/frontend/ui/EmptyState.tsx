import React from "react";
import { cn } from "./cn";

export function EmptyState({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("py-8 text-[1.4rem] text-pub-text-muted", className)} {...props} />;
}
