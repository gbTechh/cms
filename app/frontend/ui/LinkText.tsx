import React from "react";
import { Link, type LinkProps } from "@remix-run/react";
import { Text, type TextProps } from "./Text";
import { cn } from "./cn";

export interface LinkTextProps extends LinkProps {
  /** Mismas variantes de tamaño/color que <Text> — cambiás el tamaño en un solo lugar (Text.tsx). */
  variant?: TextProps["variant"];
  /** className para el <Text> interno (tipografía/color). Para el <a> en sí, usar `className`. */
  textClassName?: string;
}

/**
 * <Link> que por dentro renderiza <Text>, para que cualquier link-como-texto
 * (nav, footer, "ver perfil →", etc.) saque su tamaño de la misma tabla que
 * el resto del texto del sitio — tocás Text.tsx una vez y cambia en todos
 * lados, en vez de tener "text-[1.4rem]" repetido suelto por 10 archivos.
 */
export function LinkText({ variant = "body", className, textClassName, children, ...props }: LinkTextProps) {
  return (
    <Link className={cn("no-underline", className)} {...props}>
      <Text as="span" variant={variant} className={textClassName}>
        {children}
      </Text>
    </Link>
  );
}
