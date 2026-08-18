import { TError } from "~/admin/lib";
import { IFormSubmission, IFormSubmissionCreate, IFormSubmissionError } from "../entities";

export interface FormRepository {
  listSubmissions(
    collectionId: string,
    pagination?: { page?: number; pageSize?: number }
  ): Promise<{ submissions: IFormSubmission[]; total: number }>;
  createSubmission(data: IFormSubmissionCreate): Promise<{
    error: TError<IFormSubmissionError> | null;
    submission: IFormSubmission | null;
  }>;
  deleteSubmission(id: string): Promise<{ error: TError<IFormSubmissionError> | null }>;
}
