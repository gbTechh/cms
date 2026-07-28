import { MediaRepository, IMediaCreate } from "~/admin/interfaces";

export class MediaService {
  constructor(private repo: MediaRepository) {}

  getAll(pagination?: { page?: number; pageSize?: number }) {
    return this.repo.getAll(pagination);
  }

  getById(id: string) {
    return this.repo.getById(id);
  }

  create(data: IMediaCreate) {
    return this.repo.create(data);
  }

  update(id: string, data: { altText?: string }) {
    return this.repo.update(id, data);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
