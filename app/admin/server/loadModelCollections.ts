// utils/loadModelCollections.ts
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import type { ICollectionCreate } from "~/admin/interfaces";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const collectionsDir = path.resolve(__dirname, "../../models/collections");

export async function loadModelCollections(): Promise<ICollectionCreate[]> {
  if (!fs.existsSync(collectionsDir)) return [];

  const files = fs
    .readdirSync(collectionsDir)
    .filter((file) => file.endsWith(".ts"));

  const modules = await Promise.all(
    files.map(async (file) => {
      const mod = await import(
        /* @vite-ignore */ path.join(collectionsDir, file)
      );
      return mod.default as ICollectionCreate;
    })
  );

  return modules;
}
