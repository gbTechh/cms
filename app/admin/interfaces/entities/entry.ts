export interface IEntry {
  id: string;
  collectionId: string;
  data: Record<string, any>;
  createdAt: string;
  relationshipsFrom: IRelationship[];
  relationshipsTo: IRelationship[];
}

export interface IRelationship {
  id: string;
  fromEntryId: string;
  fromEntry?: Pick<IEntry, "id" | "data">;
  toEntryId: string;
  toEntry?: Pick<IEntry, "id" | "data">;
  type: string;
}

export interface IEntryCreate {
  collectionId: string;
  data: Record<string, any>;
}

export interface IEntryError {
  collectionId?: string;
  data?: string;
  entry_slug?: string;
}
