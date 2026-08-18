import { FormService } from "./service";
import { PrismaFormRepository } from "~/admin/infraestructure";

const PAGE_SIZE = 50;

export const listFormSubmissions = async (
  collectionId: string,
  pagination?: { page?: number }
) => {
  const page = Math.max(1, pagination?.page ?? 1);
  const service = new FormService(new PrismaFormRepository());
  const { submissions, total } = await service.listSubmissions(collectionId, {
    page,
    pageSize: PAGE_SIZE,
  });
  return { submissions, total, page, pageSize: PAGE_SIZE };
};
