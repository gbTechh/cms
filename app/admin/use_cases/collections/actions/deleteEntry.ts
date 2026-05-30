import { redirect } from "@remix-run/node";
import { CollectionService } from "../service";
import { PrismaCollectionsRepository } from "~/admin/infraestructure";
import { ROUTES } from "~/admin/constants";

export const deleteEntry = async (id: string, slug: string) => {
  const service = new CollectionService(new PrismaCollectionsRepository());
  const result = await service.deleteEntry(id);

  if (result.error?.hasError) {
    return { error: result.error };
  }

  return redirect(`${ROUTES.COLLECTIONS}/${slug}`);
};
