// /server/database.ts
import { loadCollections } from "./loadCollections";

export let models: Record<string, any> = {};

(async () => {
  const collections = await loadCollections();
  collections.forEach((collection) => {
    models[collection.name] = collection;
  });
})();
