import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * clsx + tailwind-merge, el mismo patrón que usa shadcn/ui. Dejá que un
 * componente tenga sus clases "de base" y que quien lo use pueda pisarlas
 * por `className` sin pelear con el orden de Tailwind:
 *
 *   <Card className="p-10" />   // gana sobre el p-7 de base del componente
 *
 * Sin esto, dos clases de padding conviven en el string final y gana la
 * que declaró Tailwind al azar según el orden del CSS generado.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
