import { LoaderFunctionArgs } from "@remix-run/node";
import { syncCollections } from "~/admin/server/syncCollections";
import { requireAuth } from "~/admin/use_cases";
import { logger } from "~/admin/lib/logger.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAuth(request);
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
