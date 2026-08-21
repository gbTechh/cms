export const formatDate = (iso: string | undefined): string => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" });
};
