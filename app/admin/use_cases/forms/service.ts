import { FormRepository, IFormSubmissionCreate } from "~/admin/interfaces";

export class FormService {
  constructor(private repo: FormRepository) {}

  listSubmissions(collectionId: string, pagination?: { page?: number; pageSize?: number }) {
    return this.repo.listSubmissions(collectionId, pagination);
  }

  createSubmission(data: IFormSubmissionCreate) {
    return this.repo.createSubmission(data);
  }

  deleteSubmission(id: string) {
    return this.repo.deleteSubmission(id);
  }
}
