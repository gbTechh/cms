import React from "react";
import { cn } from "./cn";

export const formatPrice = (value: unknown): string => {
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) return "Consultar precio";
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(num);
};

export interface PriceProps extends Omit<React.ComponentProps<"span">, "children"> {
  value: unknown;
  /** Texto antes del monto, ej. "Desde" */
  prefix?: string;
  size?: "sm" | "lg";
}

export function Price({ value, prefix, size = "sm", className, ...props }: PriceProps) {
  return (
    <span
      className={cn(
        "font-bold text-pub-accent",
        size === "lg" ? "text-[2.4rem]" : "text-[1.9rem]",
        className
      )}
      {...props}
    >
      {prefix ? `${prefix} ` : ""}
      {formatPrice(value)}
    </span>
  );
}
