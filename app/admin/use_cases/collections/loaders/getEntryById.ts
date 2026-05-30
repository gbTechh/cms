import { CollectionService } from "../service";
import { PrismaCollectionsRepository } from "~/admin/infraestructure";

export const getEntryById = async (id: string) => {
  const service = new CollectionService(new PrismaCollectionsRepository());
  return service.getEntryById(id);
};
