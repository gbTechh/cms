import React from "react";
import { cn } from "./cn";

export function Accordion({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex max-w-3xl flex-col gap-4", className)} {...props} />;
}

export interface AccordionItemProps extends Omit<React.ComponentProps<"details">, "title"> {
  title: React.ReactNode;
}

/** <details>/<summary> nativo — sin JS, funciona igual con o sin hidratar. */
export function AccordionItem({ title, className, children, ...props }: AccordionItemProps) {
  return (
    <details className={cn("group rounded-pub border border-pub-border bg-pub-surface px-7", className)} {...props}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 text-[1.5rem] font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <span className="shrink-0 text-[1.8rem] text-pub-accent transition-transform duration-200 group-open:rotate-45">+</span>
      </summary>
      <div className="pb-7 text-[1.4rem] leading-relaxed text-pub-text-muted">{children}</div>
    </details>
  );
}
