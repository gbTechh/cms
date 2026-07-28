export const formatPrice = (value: unknown): string => {
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) return "Consultar precio";
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(num);
};

export const formatDate = (iso: string | undefined): string => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" });
};
