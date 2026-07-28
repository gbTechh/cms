import { CollectionService } from "../service";
import { PrismaCollectionsRepository } from "~/admin/infraestructure";

export const listEntryOptions = async (slug: string) => {
  const service = new CollectionService(new PrismaCollectionsRepository());
  return service.listEntryOptions(slug);
};
