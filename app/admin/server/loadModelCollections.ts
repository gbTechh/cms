import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import type { ICollectionCreate } from "~/admin/interfaces";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const collectionsDir = path.resolve(__dirname, "../../models/collections");

export interface ExtendedCollection extends ICollectionCreate {
  fileName: string; // Nombre del archivo .ts (sin extensión)
}

export async function loadModelCollections(): Promise<ExtendedCollection[]> {
  if (!fs.existsSync(collectionsDir)) {
    console.warn(
      `⚠️ Directorio de colecciones no encontrado: ${collectionsDir}`
    );
    return [];
  }

  const files = fs
    .readdirSync(collectionsDir)
    .filter((file) => file.endsWith(".ts"));

  const modules: ExtendedCollection[] = [];
  const slugs = new Set<string>();

  for (const file of files) {
    try {
      const filePath = path.join(collectionsDir, file);
      const fileName = path.basename(file, ".ts");
      console.log(`📄 Cargando colección desde: ${file}`);
      const mod = await import(/* @vite-ignore */ filePath);
      const collection = mod.default as ICollectionCreate;

      if (collection.slug && slugs.has(collection.slug)) {
        console.error(`❌ Slug duplicado en ${file}: ${collection.slug}`);
        continue;
      }

      modules.push({
        ...collection,
        fileName,
        slug: collection.slug || "",
        name: collection.name || "",
      });

      if (collection.slug && collection.name) {
        slugs.add(collection.slug);
        console.log(
          `✅ Colección válida cargada: ${collection.slug} (archivo: ${fileName})`
        );
      } else {
        console.warn(`⚠️ Colección en ${file} no tiene slug o name válido`);
      }
    } catch (error) {
      console.error(`❌ Error al cargar la colección desde ${file}:`, error);
    }
  }

  console.log(`📚 Total de colecciones cargadas: ${modules.length}`);
  return modules;
}
