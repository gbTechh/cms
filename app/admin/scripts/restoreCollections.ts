import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaSingleton } from "../infraestructure";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = PrismaSingleton.getInstance();
const collectionsDir = path.resolve(__dirname, "../../models/collections");

// Función para generar el contenido del archivo .ts
function generateCollectionFileContent(collection: any): string {
  const fieldsString = JSON.stringify(collection.fields, null, 2);
  return `import { ICollectionCreate } from "~/admin/interfaces";

const ${collection.name.replace(/\s+/g, "")}Collection: ICollectionCreate = {
  name: "${collection.name}",
  slug: "${collection.slug}",
  fields: ${fieldsString},
  isMedia: ${collection.isMedia},
  type: "${collection.type}",
};

export default ${collection.name.replace(/\s+/g, "")}Collection;
`;
}

async function restoreCollection(fileName: string) {
  try {
    // Buscar la colección en la base de datos (activa o soft-deleted)
    const collection = await prisma.collection.findUnique({
      where: { fileName },
    });

    if (!collection) {
      console.error(
        `❌ No se encontró una colección con fileName: ${fileName}`
      );
      return;
    }

    // Generar el archivo .ts
    const filePath = path.join(collectionsDir, `${fileName}.ts`);
    const fileContent = generateCollectionFileContent(collection);

    // Verificar si el archivo ya existe
    if (fs.existsSync(filePath)) {
      console.warn(
        `⚠️ El archivo ${fileName}.ts ya existe. No se sobrescribirá.`
      );
    } else {
      fs.writeFileSync(filePath, fileContent);
      console.log(`✅ Archivo restaurado: ${fileName}.ts`);
    }

    // Reactivar la colección en la base de datos
    await prisma.collection.update({
      where: { fileName },
      data: { deletedAt: null },
    });
    console.log(
      `✅ Colección reactivada: ${collection.slug} (fileName: ${fileName})`
    );
  } catch (error) {
    console.error(`❌ Error al restaurar la colección ${fileName}:`, error);
  }
}

// Procesar el argumento de la línea de comandos
const fileName = process.argv[2];
if (!fileName) {
  console.error(
    "❌ Por favor, proporciona el fileName de la colección a restaurar."
  );
  console.error("Uso: npx ts-node scripts/restoreCollection.ts <fileName>");
  process.exit(1);
}

restoreCollection(fileName).then(() => {
  console.log("✨ Proceso de restauración completado.");
  process.exit(0);
});
