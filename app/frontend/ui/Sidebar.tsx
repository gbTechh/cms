import React from "react";
import { Link } from "@remix-run/react";
import { cn } from "./cn";
import { Text } from "./Text";

export function Sidebar({ className, ...props }: React.ComponentProps<"aside">) {
  return <aside className={cn("rounded-pub border border-pub-border bg-pub-surface p-7", className)} {...props} />;
}

export interface SidebarPersonProps {
  label: string;
  name: string;
  href: string;
}

/**
 * Patrón repetido en los detalles: "Especialista a cargo" / "Vendedor a
 * cargo" con link al perfil. No usa <LinkText> (ese es para un link de una
 * sola línea) porque acá adentro van dos líneas con tamaños distintos —
 * pero cada línea sigue sacando su tamaño de <Text>.
 */
export function SidebarPerson({ label, name, href }: SidebarPersonProps) {
  return (
    <Sidebar>
      <Text variant="small" className="mb-4 tracking-wide uppercase">{label}</Text>
      <Link to={href} className="block text-inherit no-underline">
        <Text className="mb-1 text-[1.7rem] font-bold">{name}</Text>
        <Text variant="muted">Ver perfil →</Text>
      </Link>
    </Sidebar>
  );
}
