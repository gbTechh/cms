import React from "react";
import { cn } from "./cn";
import { LinkText } from "./LinkText";

export interface SectionProps extends React.ComponentProps<"section"> {
  /** Fondo alternado (pub-surface + bordes) para separar el ritmo visual entre secciones. */
  alt?: boolean;
}

export function Section({ alt, className, children, ...props }: SectionProps) {
  // alt=true: el fondo/borde va full-bleed (pisa todo el ancho), pero el
  // contenido se sigue centrando en un contenedor propio adentro — así el
  // que usa <Section alt> no tiene que acordarse de re-centrar nada.
  if (alt) {
    return (
      <section className={cn("border-y border-pub-border bg-pub-surface", className)} {...props}>
        <div className="mx-auto max-w-6xl px-8 py-14">{children}</div>
      </section>
    );
  }
  return (
    <section className={cn("mx-auto max-w-6xl px-8 py-14", className)} {...props}>
      {children}
    </section>
  );
}

export interface SectionHeaderProps {
  title: React.ReactNode;
  action?: { label: string; to: string };
  className?: string;
}

/** Título de sección + link opcional a la derecha ("Ver todos →"). */
export function SectionHeader({ title, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-8 flex items-baseline justify-between gap-4", className)}>
      <h2 className="font-pub-display text-[2.4rem] font-bold tracking-tight">{title}</h2>
      {action && (
        <LinkText to={action.to} textClassName="font-semibold text-pub-accent hover:underline">
          {action.label}
        </LinkText>
      )}
    </div>
  );
}
