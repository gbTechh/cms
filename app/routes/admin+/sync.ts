import { syncCollections } from "~/admin/server/syncCollections";
import { logger } from "~/admin/lib/logger.server";

export const loader = async () => {
  try {
    await syncCollections();
    return Response.json({
      message: "Colecciones sincronizadas correctamente",
    });
  } catch (error) {
    logger.error({ err: error }, "Error al sincronizar colecciones");
    return Response.json(
      { error: "Error al sincronizar colecciones" },
      { status: 500 }
    );
  }
};
