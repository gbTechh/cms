import { MediaService } from "./service";
import { PrismaMediaRepository } from "~/admin/infraestructure";

export const listMedia = async () => {
  const service = new MediaService(new PrismaMediaRepository());
  const media = await service.getAll();
  return { media };
};
