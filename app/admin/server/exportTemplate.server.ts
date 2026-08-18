import { PrismaSingleton } from "~/admin/infraestructure";
import type { TemplateExport } from "~/admin/interfaces";

const prisma = PrismaSingleton.getInstance();

/**
 * Arma un snapshot completo (collections + entries + dataSingle +
 * relaciones + metadata de media) para exportar como JSON. Ver
 * TemplateExport para el formato exacto.
 */
export async function exportTemplateData(): Promise<TemplateExport> {
  const collections = await prisma.collection.findMany({
    where: { deletedAt: null },
    orderBy: { slug: "asc" },
    include: {
      entries: { orderBy: { createdAt: "asc" } },
      dataSingle: true,
    },
  });

  const entryIds = collections.flatMap((c) => c.entries.map((e) => e.id));
  const relationships = entryIds.length
    ? await prisma.relationship.findMany({
        where: { fromEntryId: { in: entryIds } },
        select: { fromEntryId: true, toEntryId: true, type: true },
      })
    : [];

  const media = await prisma.media.findMany({ orderBy: { createdAt: "asc" } });

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    collections: collections.map((c) => ({
      slug: c.slug,
      name: c.name,
      type: c.type,
      fileName: c.fileName,
      isMedia: c.isMedia,
      template: c.template,
      fields: (c.fields as any[]) ?? [],
      entries: c.entries.map((e) => ({
        id: e.id,
        data: e.data as Record<string, any>,
        createdAt: e.createdAt.toISOString(),
      })),
      dataSingle: c.dataSingle
        ? { slug: c.dataSingle.slug, data: c.dataSingle.data as Record<string, any> }
        : null,
    })),
    relationships,
    media: media.map((m) => ({
      url: m.url,
      altText: m.altText,
      mimeType: m.mimeType,
      fileSize: m.fileSize,
      width: m.width,
      height: m.height,
    })),
  };
}
