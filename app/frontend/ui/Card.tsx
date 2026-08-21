import React from "react";
import { Link, type LinkProps } from "@remix-run/react";
import { cn } from "./cn";

const base =
  "flex flex-col rounded-pub border border-pub-border bg-pub-surface p-7 text-pub-text no-underline " +
  "transition duration-150";
const hoverable = "hover:-translate-y-0.5 hover:shadow-pub";

export interface CardProps extends React.ComponentProps<"div"> {}

/** Card genérica sin link (ej. el card del formulario de reservas). */
export function Card({ className, ...props }: CardProps) {
  return <div className={cn(base, className)} {...props} />;
}

export interface CardLinkProps extends LinkProps {}

/** Card clickeable — lo que usan los listados de entries (servicios, doctores, casos...). */
export function CardLink({ className, ...props }: CardLinkProps) {
  return <Link className={cn(base, hoverable, className)} {...props} />;
}

/** Imagen (o placeholder con degradé) que se pega a los bordes de una CardLink. */
export function CardArt({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "-mx-7 -mt-7 mb-5 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-t-[calc(var(--radius-pub)-0.2rem)] bg-gradient-to-br from-pub-accent to-pub-text",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
