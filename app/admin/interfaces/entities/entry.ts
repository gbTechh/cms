export interface IEntry {
  id: string;
  collectionId: string;
  data: Record<string, any>; // { name: "Casa en la playa", price: 100000 }
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
  type: string; // "SELLER_TO_HOUSE", "PRODUCT_TO_CATEGORY"
}
export interface IRelationshipError {
  id?: string;
  fromEntryId?: string;
  fromEntry?: IEntryError;
  toEntryId?: string;
  toEntry?: IEntryError;
  type?: string; // "SELLER_TO_HOUSE", "PRODUCT_TO_CATEGORY"
}
export interface IEntryCreate {
  collectionId: string;
  data: Record<string, any>; // { name: "Casa en la playa", price: 100000 }
  createdAt: string;
  relationshipsFrom: IRelationship[];
  relationshipsTo: IRelationship[];
}

export interface IEntryError {
  collectionId: string;
  data: string; // { name: "Casa en la playa", price: 100000 }
  createdAt: string;
  relationshipsFrom: IRelationship[];
  relationshipsTo: IRelationship[];
}
