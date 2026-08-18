import { FormService } from "./service";
import { PrismaFormRepository } from "~/admin/infraestructure";

export const deleteFormSubmissionById = async (id: string): Promise<null> => {
  const service = new FormService(new PrismaFormRepository());
  await service.deleteSubmission(id);
  return null;
};
