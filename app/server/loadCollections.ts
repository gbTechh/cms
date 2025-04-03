// /server/loadCollections.ts
import fs from "fs";
import path from "path";

const collectionsDir = path.join(__dirname, "../models/collections");

export async function loadCollections() {
  const files = fs.readdirSync(collectionsDir).filter((file) => file.endsWith(".ts"));

  const collections = await Promise.all(
    files.map(async (file) => {
      const module = await import(path.join(collectionsDir, file));
      return module.default;
    })
  );

  return collections;
}
