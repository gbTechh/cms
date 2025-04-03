
import { ICollection, ICollectionCreate, ICollectionError, IEntry, IEntryCreate, IEntryError } from "../entities";
import { TError } from "~/lib/errors";

export interface CollectionRepository {
  getAllCollections(): Promise<ICollection[]>;
  getCollectionById(id: string): Promise<ICollection | null>;
  createCollection(data: ICollectionCreate): Promise<{
    error: TError<ICollectionError> | null;
    collection: ICollection | null;
  }>;
  createEntry(data: IEntryCreate): Promise<{
    error: TError<IEntryError> | null;
    entry: IEntry | null;
  }>;
  updateCollection(
    data: ICollectionCreate,
    slug: string
  ): Promise<{
    error: TError<ICollectionError> | null;
    collection: ICollection | null;
  }>;
  deleteCollection(id: string): Promise<{
    error: TError<ICollectionError> | null;
    collection: ICollection | null;
  }>;
  deleteEntry(id: string): Promise<{
    error: TError<IEntryError> | null;
    entry: IEntry | null;
  }>;
}
