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
  fromEntry?: IEntry;
  toEntryId: string;
  toEntry?: IEntry;
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
