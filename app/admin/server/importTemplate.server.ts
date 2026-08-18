import { PrismaSingleton } from "~/admin/infraestructure";
import type { TemplateExport, TemplateImportSummary } from "~/admin/interfaces";
import { validateCollection } from "~/admin/lib";

const prisma = PrismaSingleton.getInstance();

/**
 * Aplica un JSON exportado con exportTemplateData(). Es idempotente: se
 * puede correr varias veces sin duplicar nada.
 *  - Collection: upsert por `fileName` (misma clave que usa syncCollections).
 *  - Entry: upsert por `id` (el export preserva los ids para que las
 *    relaciones sigan apuntando a donde deben).
 *  - DataSingle: upsert por `collectionId`.
 *  - Relationship: se reemplazan por completo las de los entries importados
 *    (delete + recreate), igual que hace CollectionService.syncEntryRelationships.
 *  - Media: se crea solo si no existe ya un registro con esa `url`.
 * Los binarios de /public/uploads NO se restauran acá — hay que copiarlos
 * aparte si se migran medios entre entornos.
 */
export async function importTemplateData(input: TemplateExport): Promise<TemplateImportSummary> {
  if (!input || !Array.isArray(input.collections)) {
    throw new Error("JSON inválido: se esperaba un objeto con `collections: [...]`");
  }

  const warnings: string[] = [];
  let entryCount = 0;

  for (const col of input.collections) {
    const result = validateCollection(col);
    if (!result.success) {
      warnings.push(`Colección "${col.slug ?? "?"}" omitida: ${JSON.stringify(result.error.flatten())}`);
      continue;
    }

    await prisma.$transaction(async (tx) => {
      const collection = await tx.collection.upsert({
        where: { fileName: col.fileName },
        update: {
          slug: col.slug,
          name: col.name,
          type: col.type,
          template: col.template ?? null,
          fields: col.fields as any,
          isMedia: col.isMedia ?? false,
          deletedAt: null,
        },
        create: {
          slug: col.slug,
          name: col.name,
          type: col.type,
          template: col.template ?? null,
          fields: col.fields as any,
          isMedia: col.isMedia ?? false,
          fileName: col.fileName,
        },
      });

      if (col.dataSingle) {
        await tx.dataSingle.upsert({
          where: { collectionId: collection.id },
          update: { slug: col.dataSingle.slug, data: col.dataSingle.data },
          create: { collectionId: collection.id, slug: col.dataSingle.slug, data: col.dataSingle.data },
        });
      }

      for (const entry of col.entries ?? []) {
        await tx.entry.upsert({
          where: { id: entry.id },
          update: { collectionId: collection.id, data: entry.data },
          create: { id: entry.id, collectionId: collection.id, data: entry.data },
        });
        entryCount += 1;
      }
    });
  }

  // Relaciones: se reemplazan por completo las que salen de los entries
  // que acabamos de importar (mismo criterio que syncEntryRelationships).
  let relationshipCount = 0;
  const importedEntryIds = input.collections.flatMap((c) => (c.entries ?? []).map((e) => e.id));
  if (importedEntryIds.length > 0) {
    await prisma.relationship.deleteMany({ where: { fromEntryId: { in: importedEntryIds } } });

    const validRelationships = (input.relationships ?? []).filter((r) =>
      importedEntryIds.includes(r.fromEntryId)
    );
    if (validRelationships.length > 0) {
      await prisma.relationship.createMany({ data: validRelationships });
      relationshipCount = validRelationships.length;
    }
  }

  let mediaCount = 0;
  for (const m of input.media ?? []) {
    const existing = await prisma.media.findFirst({ where: { url: m.url } });
    if (!existing) {
      await prisma.media.create({ data: m });
      mediaCount += 1;
    }
  }

  return {
    collections: input.collections.length - warnings.length,
    entries: entryCount,
    relationships: relationshipCount,
    media: mediaCount,
    warnings,
  };
}
