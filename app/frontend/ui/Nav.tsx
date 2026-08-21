import React from "react";
import { Link } from "@remix-run/react";
import { cn } from "./cn";
import { LinkText } from "./LinkText";
import { ButtonLink } from "./Button";

export interface NavLink {
  to: string;
  label: string;
}

export interface NavProps extends React.ComponentProps<"header"> {
  brand: React.ReactNode;
  brandHref?: string;
  links: NavLink[];
  cta?: NavLink;
}

/** Header del sitio: marca + links + CTA opcional. El contenido (marca, links) lo define el Layout de cada proyecto. */
export function Nav({ brand, brandHref = "/", links, cta, className, ...props }: NavProps) {
  return (
    <header className={cn("sticky top-0 z-10 border-b border-pub-border bg-pub-surface", className)} {...props}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-8 py-5">
        <Link to={brandHref} className="shrink-0 font-pub-display text-2xl font-bold tracking-tight text-pub-text">
          {brand}
        </Link>
        <nav className="flex flex-wrap items-center gap-8">
          {links.map((link) => (
            <LinkText key={link.to} to={link.to} variant="muted" textClassName="font-medium hover:text-pub-accent">
              {link.label}
            </LinkText>
          ))}
          {cta && (
            <ButtonLink to={cta.to} className="px-6 py-3 text-[1.3rem]">
              {cta.label}
            </ButtonLink>
          )}
        </nav>
      </div>
    </header>
  );
}
