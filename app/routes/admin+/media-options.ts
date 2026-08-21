import { LoaderFunctionArgs } from "@remix-run/node";
import { requireAuth } from "~/admin/use_cases";
import { MediaService } from "~/admin/use_cases/media/service";
import { PrismaMediaRepository } from "~/admin/infraestructure";

// Opciones para el MediaPicker de campos "upload" (ver FieldFactory.tsx +
// MediaPicker.tsx) — mismo rol que relationship-options.$slug.ts, pero
// consultando la tabla Media en vez de Entry (son modelos separados, un
// campo upload no puede ser un relationship: ver la conversación en el
// README/chat sobre por qué). Trae hasta 200 archivos más recientes; el
// filtro por texto lo hace el propio picker en cliente (mismo patrón que
// MediaPage.tsx).
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAuth(request);
  const service = new MediaService(new PrismaMediaRepository());
  const { media } = await service.getAll({ page: 1, pageSize: 200 });
  return Response.json({ media });
};
