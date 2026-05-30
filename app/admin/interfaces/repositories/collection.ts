import { TError } from "~/admin/lib";
import {
  ICollection,
  IEntry,
  IEntryCreate,
  IEntryError,
} from "../entities";

export interface CollectionRepository {
  getJustCollections(): Promise<ICollection[]>;
  getAllCollections(): Promise<ICollection[]>;
  getCollectionBySlug(slug: string): Promise<ICollection | null>;
  getEntryById(id: string): Promise<IEntry | null>;
  findEntryBySlug(collectionId: string, slug: string, excludeId?: string): Promise<IEntry | null>;
  createEntry(data: IEntryCreate): Promise<{
    error: TError<IEntryError> | null;
    entry: IEntry | null;
  }>;
  updateEntry(id: string, data: Record<string, any>): Promise<{
    error: TError<IEntryError> | null;
    entry: IEntry | null;
  }>;
  deleteEntry(id: string): Promise<{
    error: TError<IEntryError> | null;
    entry: IEntry | null;
  }>;
}
