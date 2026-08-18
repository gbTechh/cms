import { PrismaSingleton } from "~/admin/infraestructure";
import { validateCollection } from "../lib";
import { loadModelCollections } from "./loadModelCollections";

const prisma = PrismaSingleton.getInstance();

export async function syncCollections() {
  // Cargar colecciones desde archivos
  const modelCollections = await loadModelCollections();
  if (modelCollections.length === 0) {
    console.warn("⚠️ No se encontraron colecciones para sincronizar.");
    return;
  }

  // Obtener colecciones de la base de datos (incluyendo soft-deleted)
  const dbCollections = await prisma.collection.findMany({
    where: {
      // Incluye tanto activas como soft-deleted para manejar reactivación
    },
  });
  console.log(
    `📊 Colecciones en la base de datos: ${dbCollections
      .map(
        (c) => `${c.slug} (${c.fileName}${c.deletedAt ? ", soft-deleted" : ""})`
      )
      .join(", ")}`
  );

  // Mapa de archivos existentes
  const allModelFiles = new Set(modelCollections.map((c) => c.fileName));
  console.log(
    `📂 Archivos de colecciones: ${Array.from(allModelFiles).join(", ")}`
  );

  // Procesar colecciones (crear, actualizar o reactivar solo las válidas)
  for (const model of modelCollections) {
    // Verificar si tiene slug y name válidos
    if (!model.slug || !model.name) {
      console.warn(
        `⚠️ Colección en ${model.fileName}.ts no se procesará: falta slug o name.`
      );
      continue;
    }

    // Validar la colección con Zod
    const result = validateCollection(model);
    if (!result.success) {
      console.error(
        `❌ ERROR en la colección ${model.name} (${model.slug}, archivo: ${model.fileName}):`,
        result.error.flatten()
      );
      console.log(
        `ℹ️ Colección ${model.slug} no se procesará, pero no se eliminará (archivo: ${model.fileName}).`
      );
      continue;
    }

    try {
      await prisma.$transaction(async (tx) => {
        const collection = await tx.collection.upsert({
          where: { fileName: model.fileName }, // Usar fileName como clave única
          update: {
            slug: model.slug,
            name: model.name,
            type: model.type ?? "collection",
            template: model.template ?? null,
            fields: model.fields as any,
            isMedia: model.isMedia ?? false,
            deletedAt: null, // Reactivar si estaba soft-deleted
          },
          create: {
            slug: model.slug,
            name: model.name,
            type: model.type ?? "collection",
            template: model.template ?? null,
            fields: model.fields as any,
            isMedia: model.isMedia ?? false,
            fileName: model.fileName,
            deletedAt: null, // Nueva colección activa
          },
        });

        // Las colecciones "global"/"page" son singles: un único registro de
        // datos (DataSingle) en vez de una lista de entries. Nos aseguramos
        // de que ese registro exista para que se pueda editar de inmediato.
        // Las colecciones "form" no usan DataSingle: sus registros son los
        // FormSubmission que van llegando desde el sitio público.
        if (collection.type === "global" || collection.type === "page") {
          await tx.dataSingle.upsert({
            where: { collectionId: collection.id },
            update: {},
            create: { collectionId: collection.id, slug: collection.slug, data: {} },
          });
        }
      });
      console.log(
        `✅ Colección sincronizada: ${model.slug} (archivo: ${model.fileName})`
      );
    } catch (error) {
      console.error(
        `❌ Error al sincronizar la colección ${model.slug} (archivo: ${model.fileName}):`,
        error
      );
    }
  }

  // Marcar como soft-deleted las colecciones cuyos archivos .ts ya no existen
  const toSoftDelete = dbCollections
    .filter(
      (dbCollection) =>
        !allModelFiles.has(dbCollection.fileName) && !dbCollection.deletedAt // Solo las no eliminadas
    )
    .map((c) => c.fileName);

  if (toSoftDelete.length > 0) {
    console.log(`🗑️ Colecciones para soft delete: ${toSoftDelete.join(", ")}`);
    for (const fileName of toSoftDelete) {
      try {
        await prisma.collection.update({
          where: { fileName },
          data: { deletedAt: new Date() },
        });
        console.log(`🗑️ Colección marcada como soft-deleted: ${fileName}`);
      } catch (error) {
        console.error(
          `❌ Error al marcar soft delete para ${fileName}:`,
          error
        );
      }
    }
  } else {
    console.log("ℹ️ No hay colecciones para soft delete.");
  }

  console.log("✨ Sincronización de colecciones completada.");
}
