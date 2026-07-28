import { MediaService } from "./service";
import { PrismaMediaRepository } from "~/admin/infraestructure";

const PAGE_SIZE = 60;

export const listMedia = async (pagination?: { page?: number }) => {
  const page = Math.max(1, pagination?.page ?? 1);
  const service = new MediaService(new PrismaMediaRepository());
  const { media, total } = await service.getAll({ page, pageSize: PAGE_SIZE });
  return { media, total, page, pageSize: PAGE_SIZE };
};
