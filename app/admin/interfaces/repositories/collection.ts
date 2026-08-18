import { TError } from "~/admin/lib";
import {
  ICollection,
  IDataSingle,
  IEntry,
  IEntryCreate,
  IEntryError,
} from "../entities";

export interface CollectionRepository {
  getJustCollections(): Promise<ICollection[]>;
  getAllCollections(): Promise<ICollection[]>;
  getCollectionBySlug(
    slug: string,
    pagination?: { page?: number; pageSize?: number }
  ): Promise<ICollection | null>;
  getCollectionById(id: string): Promise<ICollection | null>;
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
  listEntryOptions(slug: string): Promise<{ value: string; label: string }[]>;
  countValidEntryIds(slug: string, ids: string[]): Promise<number>;
  syncRelationships(fromEntryId: string, type: string, toEntryIds: string[]): Promise<void>;
  upsertDataSingle(
    collectionId: string,
    slug: string,
    data: Record<string, any>
  ): Promise<{
    error: TError<IEntryError> | null;
    dataSingle: IDataSingle | null;
  }>;
}
