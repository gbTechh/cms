import { CollectionService } from "../service";
import { PrismaCollectionsRepository } from "~/admin/infraestructure";

export const updateDataSingle = async (
  collectionId: string,
  slug: string,
  data: Record<string, any>
) => {
  const service = new CollectionService(new PrismaCollectionsRepository());
  const result = await service.updateDataSingle(collectionId, slug, data);

  if (result.error?.hasError) {
    return { error: result.error };
  }

  return { dataSingle: result.dataSingle };
};
