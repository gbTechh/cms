// Única puerta de entrada a datos para app/frontend/**. Todo lo que hay acá
// abajo es un re-export con nombre claro de lo que ya vive en
// app/content/queries.server.ts y app/content/theme.server.ts (Prisma real,
// backend real) — un template nunca debería importar esos archivos
// directo, ni saber que Prisma existe. Si mañana el backend cambia de
// motor de datos, solo se toca esta fachada.
//
// Uso típico en un loader de ruta:
//
//   import { getEntries, getEntry } from "~/frontend/data/client.server";
//   export const loader = () => getEntries("services", { pageSize: 6 });
//
import {
  getPublicCollection,
  getPublicEntry,
  getPublicSingle,
  listPublicCollections,
  searchPublicCollection,
  type PublicCollection,
  type PublicEntry,
  type PublicEntryDetail,
  type RelatedEntryRef,
} from "~/content/queries.server";
import { getSiteTheme, type SiteTheme } from "~/content/theme.server";

export type { PublicCollection, PublicEntry, PublicEntryDetail, RelatedEntryRef, SiteTheme };

/** Lista de collections públicas disponibles (slug + name), para armar un nav dinámico por ejemplo. */
export const getCollections = listPublicCollections;

/** Entries paginadas de una collection, con sus `fields` (para saber qué hay en `data`). */
export const getEntries = getPublicCollection;

/** Una entry puntual por slug de collection + slug de entry, con relaciones resueltas en ambos sentidos. */
export const getEntry = getPublicEntry;

/** El `data` de un Single (ej. "site-settings"). Objeto vacío si no tiene nada cargado, `null` si no existe. */
export const getSingle = getPublicSingle;

/** Búsqueda de texto libre dentro de una collection (ver queries.server.ts para el detalle de qué matchea). */
export const searchEntries = searchPublicCollection;

/** Tema visual activo (`modern` / `classic` / `dental`, o el que se agregue) según el Single "site-settings". */
export const getTheme = getSiteTheme;
