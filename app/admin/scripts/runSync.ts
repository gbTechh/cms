// Entry point de CLI para `npm run sync`. La función en sí vive en
// ~/admin/server/syncCollections (sin auto-ejecutarse al importarla), porque
// esa ruta también la usa `admin+/sync.ts` y no debe correr como side-effect
// de simplemente importar el módulo.
import { syncCollections } from "~/admin/server/syncCollections";

syncCollections()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error al sincronizar colecciones:", error);
    process.exit(1);
  });
