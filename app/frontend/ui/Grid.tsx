import React from "react";
import { cn } from "./cn";

export function Grid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6", className)}
      {...props}
    />
  );
}
