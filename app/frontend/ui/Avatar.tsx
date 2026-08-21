import React from "react";
import { cn } from "./cn";

const initialsOf = (name: string) =>
  name
    .replace(/^(Dr\.|Dra\.)\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export interface AvatarProps extends Omit<React.ComponentProps<"div">, "children"> {
  name: string;
  /** Si hay foto real (campo `upload`), se muestra en vez de las iniciales. */
  src?: string | null;
  size?: "md" | "lg";
}

/** Avatar con iniciales — evita fotos rotas mientras el cliente no suba una real. */
export function Avatar({ name, src, size = "md", className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-pub-accent to-pub-text font-pub-display font-bold text-white",
        size === "lg" ? "h-32 w-32 text-[2.6rem]" : "h-14 w-14 text-[1.9rem]",
        className
      )}
      {...props}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initialsOf(name)}
    </div>
  );
}
