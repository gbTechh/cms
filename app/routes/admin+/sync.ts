import { syncCollections } from "~/admin/server/syncCollections";

export const loader = async () => {
  try {
    await syncCollections();
    return Response.json({
      message: "Colecciones sincronizadas correctamente",
    });
  } catch (error) {
    console.log(error)
    return Response.json(
      { error: "Error al sincronizar colecciones" },
      { status: 500 }
    );
  }
};
