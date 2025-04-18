import { PrismaSingleton } from "../infraestructure";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = PrismaSingleton.getInstance();
const collectionsDir = path.resolve(__dirname, "../models/collections");

async function importCollections(backupFile: string) {
  try {
    // Leer el archivo JSON
    const backupPath = path.resolve(backupFile);
    if (!fs.existsSync(backupPath)) {
      console.error(`❌ Archivo de respaldo no encontrado: ${backupFile}`);
      return;
    }

    const collections = JSON.parse(fs.readFileSync(backupPath, "utf-8"));
    if (!Array.isArray(collections)) {
      console.error("❌ Formato de respaldo inválido. Se esperaba un array.");
      return;
    }

    // Procesar cada colección
    for (const collection of collections) {
      try {
        await prisma.$transaction(async (tx) => {
          await tx.collection.upsert({
            where: { fileName: collection.fileName },
            update: {
              slug: collection.slug,
              name: collection.name,
              fields: collection.fields,
              isMedia: collection.isMedia,
              deletedAt: collection.deletedAt, // Mantener el estado soft-deleted
            },
            create: {
              slug: collection.slug,
              name: collection.name,
              fields: collection.fields,
              isMedia: collection.isMedia,
              fileName: collection.fileName,
              deletedAt: collection.deletedAt,
            },
          });
        });
        console.log(
          `✅ Colección importada: ${collection.slug} (fileName: ${collection.fileName})`
        );

        // Opcional: Generar archivo .ts
        const filePath = path.join(collectionsDir, `${collection.fileName}.ts`);
        if (!fs.existsSync(filePath)) {
          const fileContent = generateCollectionFileContent(collection);
          fs.writeFileSync(filePath, fileContent);
          console.log(`✅ Archivo generado: ${collection.fileName}.ts`);
        }
      } catch (error) {
        console.error(
          `❌ Error al importar la colección ${collection.slug} (fileName: ${collection.fileName}):`,
          error
        );
      }
    }
  } catch (error) {
    console.error("❌ Error al importar colecciones:", error);
  }
}

// Reutilizamos la función de restoreCollection.ts
function generateCollectionFileContent(collection: any): string {
  const fieldsString = JSON.stringify(collection.fields, null, 2);
  return `import { ICollectionCreate } from "~/admin/interfaces";

const ${collection.name.replace(/\s+/g, "")}Collection: ICollectionCreate = {
  name: "${collection.name}",
  slug: "${collection.slug}",
  fields: ${fieldsString},
  isMedia: ${collection.isMedia},
};

export default ${collection.name.replace(/\s+/g, "")}Collection;
`;
}

// Procesar el argumento de la línea de comandos
const backupFile = process.argv[2];
if (!backupFile) {
  console.error("❌ Por favor, proporciona la ruta al archivo de respaldo.");
  console.error(
    "Uso: npx ts-node scripts/importCollections.ts <ruta-al-archivo-json>"
  );
  process.exit(1);
}

importCollections(backupFile).then(() => {
  console.log("✨ Importación de colecciones completada.");
  process.exit(0);
});
