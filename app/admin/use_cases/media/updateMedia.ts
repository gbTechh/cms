import { MediaService } from "./service";
import { PrismaMediaRepository } from "~/admin/infraestructure";

export const updateMediaById = async (id: string, altText: string): Promise<null> => {
  const service = new MediaService(new PrismaMediaRepository());
  await service.update(id, { altText: altText || undefined });
  return null;
};
