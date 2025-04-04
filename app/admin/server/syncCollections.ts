// scripts/syncCollections.ts

import { PrismaSingleton } from "../infraestructure";
import { loadModelCollections } from "./loadModelCollections";

const prisma = PrismaSingleton.getInstance();

export async function syncCollections() {
  const modelCollections = await loadModelCollections();
  const dbCollections = await prisma.collection.findMany();

  const modelSlugs = modelCollections.map((c) => c.slug);
  const dbSlugs = dbCollections.map((c) => c.slug);

  // Crear nuevas
  for (const model of modelCollections) {
    const exists = dbSlugs.includes(model.slug);
    if (!exists) {
      await prisma.collection.create({
        data: {
          name: model.name,
          slug: model.slug,
          fields: model.fields as any,
        },
      });
      console.log(`✅ Colección creada: ${model.slug}`);
    }
  }

  // Actualizar campos (puedes mejorarlo con un comparador de `fields`)
  for (const model of modelCollections) {
    const db = dbCollections.find((c) => c.slug === model.slug);
    if (db && JSON.stringify(db.fields) !== JSON.stringify(model.fields)) {
      await prisma.collection.update({
        where: { slug: model.slug },
        data: {
          name: model.name,
          fields: model.fields as any,
        },
      });
      console.log(`🔁 Colección actualizada: ${model.slug}`);
    }
  }

  // Eliminar las que ya no existen como archivos
  const toDelete = dbSlugs.filter((slug) => !modelSlugs.includes(slug));
  for (const slug of toDelete) {
    await prisma.collection.delete({
      where: { slug },
    });
    console.log(`❌ Colección eliminada: ${slug}`);
  }

  console.log("✨ Sincronización de colecciones completada.");
}
