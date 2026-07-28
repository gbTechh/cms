import { PrismaSingleton } from "~/admin/infraestructure";
import { IField } from "~/admin/interfaces";

const prisma = PrismaSingleton.getInstance();

// Una entrada se considera publicada salvo que explícitamente diga "draft"
// en meta_status (campo universal de texto libre que ya trae EntryNew).
const isPublished = (data: unknown) => {
  const status = (data as Record<string, any> | null)?.meta_status;
  return status !== "draft";
};

export interface PublicEntry {
  id: string;
  slug: string;
  data: Record<string, any>;
  createdAt: string;
}

export interface PublicCollection {
  id: string;
  slug: string;
  name: string;
  fields: IField[];
  entries: PublicEntry[];
  total: number;
  page: number;
  pageSize: number;
}

export interface RelatedEntryRef {
  type: string;
  collectionSlug: string;
  collectionName: string;
  id: string;
  slug: string;
  name: string;
}

export interface PublicEntryDetail {
  collection: { slug: string; name: string; fields: IField[] };
  entry: PublicEntry;
  // Entradas que ESTA entrada referencia (ej. la propiedad -> su vendedor)
  relatedTo: RelatedEntryRef[];
  // Entradas que referencian a ESTA (ej. el vendedor <- sus propiedades)
  referencedBy: RelatedEntryRef[];
}

const mapPublicEntry = (e: { id: string; data: unknown; createdAt: Date }): PublicEntry => {
  const data = e.data as Record<string, any>;
  return {
    id: e.id,
    slug: data?.entry_slug ?? e.id,
    data,
    createdAt: e.createdAt.toISOString(),
  };
};

/** Lista todas las colecciones de contenido disponibles (no medios). */
export async function listPublicCollections(): Promise<{ slug: string; name: string }[]> {
  const collections = await prisma.collection.findMany({
    where: { deletedAt: null, isMedia: false },
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });
  return collections;
}

/**
 * Trae una colección por slug junto a sus campos y sus entradas publicadas,
 * paginadas. Sirve para CUALQUIER colección — no hace falta tocar esta
 * función al crear una colección nueva.
 */
export async function getPublicCollection(
  slug: string,
  options?: { page?: number; pageSize?: number }
): Promise<PublicCollection | null> {
  const page = Math.max(1, options?.page ?? 1);
  const pageSize = options?.pageSize ?? 12;

  const collection = await prisma.collection.findUnique({ where: { slug } });
  if (!collection || collection.deletedAt) return null;

  const allEntries = await prisma.entry.findMany({
    where: { collectionId: collection.id },
    orderBy: { createdAt: "desc" },
  });

  const published = allEntries.filter((e) => isPublished(e.data));
  const total = published.length;
  const start = (page - 1) * pageSize;
  const pageEntries = published.slice(start, start + pageSize);

  return {
    id: collection.id,
    slug: collection.slug,
    name: collection.name,
    fields: collection.fields as unknown as IField[],
    entries: pageEntries.map(mapPublicEntry),
    total,
    page,
    pageSize,
  };
}

const toRelatedRef = (rel: {
  type: string;
  entry: { id: string; data: unknown; collection: { slug: string; name: string } };
}): RelatedEntryRef => {
  const data = rel.entry.data as Record<string, any>;
  return {
    type: rel.type,
    collectionSlug: rel.entry.collection.slug,
    collectionName: rel.entry.collection.name,
    id: rel.entry.id,
    slug: data?.entry_slug ?? rel.entry.id,
    name: data?.entry_name ?? data?.entry_slug ?? rel.entry.id,
  };
};

/**
 * Trae una entrada publicada por slug dentro de una colección, con sus
 * relaciones resueltas en ambas direcciones (a quién referencia, y quién la
 * referencia a ella). Igual que getPublicCollection, sirve para cualquier
 * colección sin necesidad de código nuevo.
 */
export async function getPublicEntry(
  collectionSlug: string,
  entrySlug: string
): Promise<PublicEntryDetail | null> {
  const collection = await prisma.collection.findUnique({ where: { slug: collectionSlug } });
  if (!collection || collection.deletedAt) return null;

  const entry = await prisma.entry.findFirst({
    where: {
      collectionId: collection.id,
      data: { path: ["entry_slug"], equals: entrySlug },
    },
    include: {
      relationshipsFrom: { include: { toEntry: { include: { collection: true } } } },
      relationshipsTo: { include: { fromEntry: { include: { collection: true } } } },
    },
  });
  if (!entry || !isPublished(entry.data)) return null;

  return {
    collection: {
      slug: collection.slug,
      name: collection.name,
      fields: collection.fields as unknown as IField[],
    },
    entry: mapPublicEntry(entry),
    relatedTo: entry.relationshipsFrom.map((r) =>
      toRelatedRef({ type: r.type, entry: r.toEntry })
    ),
    referencedBy: entry.relationshipsTo.map((r) =>
      toRelatedRef({ type: r.type, entry: r.fromEntry })
    ),
  };
}
