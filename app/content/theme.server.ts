import { PrismaSingleton } from "~/admin/infraestructure";

const prisma = PrismaSingleton.getInstance();

export type SiteTheme = "modern" | "classic" | "dental";

const DEFAULT_THEME: SiteTheme = "modern";
const VALID_THEMES: SiteTheme[] = ["modern", "classic", "dental"];

const isSiteTheme = (value: unknown): value is SiteTheme =>
  typeof value === "string" && (VALID_THEMES as string[]).includes(value);

/**
 * Lee el tema visual elegido en el Single "site-settings" (admin → Singles
 * → Configuración del sitio). Si la colección/single todavía no existe
 * (proyecto recién clonado, antes del primer `npm run sync`), cae al tema
 * por defecto sin romper nada.
 */
export async function getSiteTheme(): Promise<SiteTheme> {
  const collection = await prisma.collection.findUnique({
    where: { slug: "site-settings" },
    include: { dataSingle: true },
  });
  const value = (collection?.dataSingle?.data as Record<string, any> | undefined)?.theme;
  return isSiteTheme(value) ? value : DEFAULT_THEME;
}
