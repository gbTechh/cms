import React from "react";
import { cn } from "./cn";
import { LinkText } from "./LinkText";

export interface FooterColumn {
  heading: string;
  links: { to: string; label: string }[];
}

export interface FooterProps extends React.ComponentProps<"footer"> {
  brand: React.ReactNode;
  tagline: React.ReactNode;
  columns: FooterColumn[];
  /** Última columna en texto libre (dirección/teléfono/email) en vez de links. */
  contact?: React.ReactNode;
  bottomText: React.ReactNode;
}

export function Footer({ brand, tagline, columns, contact, bottomText, className, ...props }: FooterProps) {
  return (
    <footer className={cn("mt-20 border-t border-pub-border bg-pub-surface", className)} {...props}>
      <div className="mx-auto grid max-w-6xl gap-12 px-8 py-16 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="mb-3 font-pub-display text-2xl font-bold text-pub-text">{brand}</p>
          <p className="max-w-[32ch] text-[1.35rem] leading-relaxed text-pub-text-muted">{tagline}</p>
        </div>
        {columns.map((col) => (
          <div key={col.heading}>
            <p className="mb-5 text-[1.2rem] font-bold tracking-wide text-pub-text-muted uppercase">{col.heading}</p>
            <div className="flex flex-col gap-3">
              {col.links.map((link) => (
                <LinkText key={link.to} to={link.to} textClassName="hover:text-pub-accent">
                  {link.label}
                </LinkText>
              ))}
            </div>
          </div>
        ))}
        {contact && (
          <div>
            <p className="mb-5 text-[1.2rem] font-bold tracking-wide text-pub-text-muted uppercase">Contacto</p>
            <p className="text-[1.4rem] leading-relaxed text-pub-text-muted">{contact}</p>
          </div>
        )}
      </div>
      <div className="mx-auto max-w-6xl border-t border-pub-border px-8 py-8 text-[1.25rem] text-pub-text-muted">
        {bottomText}
      </div>
    </footer>
  );
}
