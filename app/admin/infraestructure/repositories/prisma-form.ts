import { PrismaSingleton } from "../bd";
import {
  FormRepository,
  IFormSubmission,
  IFormSubmissionCreate,
  IFormSubmissionError,
} from "~/admin/interfaces";
import { CatchError, TError } from "~/admin/lib";
import { logger } from "~/admin/lib/logger.server";

const prisma = PrismaSingleton.getInstance();

const mapSubmission = (s: any): IFormSubmission => ({
  id: s.id,
  collectionId: s.collectionId,
  data: s.data as Record<string, any>,
  createdAt: s.createdAt.toISOString(),
});

export class PrismaFormRepository implements FormRepository {
  async listSubmissions(
    collectionId: string,
    pagination?: { page?: number; pageSize?: number }
  ): Promise<{ submissions: IFormSubmission[]; total: number }> {
    const page = Math.max(1, pagination?.page ?? 1);
    const pageSize = pagination?.pageSize ?? 50;

    const [data, total] = await Promise.all([
      prisma.formSubmission.findMany({
        where: { collectionId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.formSubmission.count({ where: { collectionId } }),
    ]);

    return { submissions: data.map(mapSubmission), total };
  }

  async createSubmission(input: IFormSubmissionCreate): Promise<{
    error: TError<IFormSubmissionError> | null;
    submission: IFormSubmission | null;
  }> {
    try {
      const submission = await prisma.formSubmission.create({
        data: {
          collectionId: input.collectionId,
          data: input.data,
        },
      });
      return { error: null, submission: mapSubmission(submission) };
    } catch (error) {
      logger.error({ err: error }, "Error al guardar envío de formulario");
      return { error: CatchError(error, "guardar"), submission: null };
    }
  }

  async deleteSubmission(id: string): Promise<{ error: TError<IFormSubmissionError> | null }> {
    try {
      await prisma.formSubmission.delete({ where: { id } });
      return { error: null };
    } catch (error) {
      logger.error({ err: error }, "Error al eliminar envío de formulario");
      return { error: CatchError(error, "eliminar") };
    }
  }
}
