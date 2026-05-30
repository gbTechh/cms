import { PrismaSingleton } from "../infraestructure";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = PrismaSingleton.getInstance();
const backupDir = path.resolve(__dirname, "../../backups/collections");

async function exportCollections() {
  try {
    // Crear directorio de backups si no existe
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Obtener todas las colecciones (activas y soft-deleted)
    const collections = await prisma.collection.findMany();

    if (collections.length === 0) {
      console.warn("⚠️ No se encontraron colecciones para exportar.");
      return;
    }

    // Exportar a JSON
    const backupFile = path.join(
      backupDir,
      `collections-backup-${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.json`
    );
    fs.writeFileSync(backupFile, JSON.stringify(collections, null, 2));
    console.log(`✅ Colecciones exportadas a: ${backupFile}`);

    // Opcional: Exportar como archivos .ts individuales
    for (const collection of collections) {
      const filePath = path.join(backupDir, `${collection.fileName}.ts`);
      const fileContent = generateCollectionFileContent(collection);
      fs.writeFileSync(filePath, fileContent);
      console.log(`✅ Archivo de respaldo creado: ${collection.fileName}.ts`);
    }
  } catch (error) {
    console.error("❌ Error al exportar colecciones:", error);
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

exportCollections().then(() => {
  console.log("✨ Exportación de colecciones completada.");
  process.exit(0);
});
