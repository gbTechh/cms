import React from "react";
import { Link } from "@remix-run/react";
import { cn } from "./cn";

export interface PaginationProps {
  page: number;
  totalPages: number;
  /** ej. (p) => `/services?page=${p}` */
  hrefFor: (page: number) => string;
}

export function Pagination({ page, totalPages, hrefFor }: PaginationProps) {
  if (totalPages <= 1) return null;
  const linkCls = "rounded-pub border border-pub-border px-6 py-3 text-[1.3rem] font-semibold text-pub-text hover:border-pub-accent hover:text-pub-accent";
  return (
    <div className="mt-10 flex justify-center gap-4">
      <Link to={hrefFor(page - 1)} className={cn(linkCls, page <= 1 && "pointer-events-none opacity-40")}>
        Anterior
      </Link>
      <Link to={hrefFor(page + 1)} className={cn(linkCls, page >= totalPages && "pointer-events-none opacity-40")}>
        Siguiente
      </Link>
    </div>
  );
}
