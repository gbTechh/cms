import React from "react";
import { Link, type LinkProps } from "@remix-run/react";
import { cn } from "./cn";

type Variant = "solid" | "outline" | "inverse";

const VARIANT_CLASS: Record<Variant, string> = {
  solid: "bg-pub-accent text-white hover:bg-pub-accent-hover",
  outline: "border-[1.5px] border-pub-border text-pub-text hover:border-pub-accent hover:text-pub-accent",
  // Para usar sobre fondos oscuros/con degradé (ej. el hero)
  inverse: "bg-white text-pub-text hover:opacity-90",
};

const base = "inline-flex items-center justify-center rounded-full px-8 py-4 text-[1.4rem] font-bold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-60";

export interface ButtonLinkProps extends LinkProps {
  variant?: Variant;
}

/** Botón de navegación (Remix <Link>). Usar para cualquier CTA que cambia de página. */
export function ButtonLink({ variant = "solid", className, ...props }: ButtonLinkProps) {
  return <Link className={cn(base, VARIANT_CLASS[variant], className)} {...props} />;
}

export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: Variant;
}

/** Botón de acción real (submit de un form, etc.). Para navegar, usar <ButtonLink>. */
export function Button({ variant = "solid", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(base, VARIANT_CLASS[variant], className)} {...props} />;
}
