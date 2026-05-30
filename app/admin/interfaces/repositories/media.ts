import { TError } from "~/admin/lib";
import { IMedia, IMediaCreate, IMediaError } from "../entities";

export interface MediaRepository {
  getAll(): Promise<IMedia[]>;
  getById(id: string): Promise<IMedia | null>;
  create(data: IMediaCreate): Promise<{ error: TError<IMediaError> | null; media: IMedia | null }>;
  update(id: string, data: { altText?: string }): Promise<{ error: TError<IMediaError> | null; media: IMedia | null }>;
  delete(id: string): Promise<{ error: TError<IMediaError> | null }>;
}
