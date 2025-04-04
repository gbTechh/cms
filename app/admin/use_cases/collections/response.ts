import { StatusEnum } from "@prisma/client";
import { ICollection, IEntry } from "~/admin/interfaces";

export class CollectionResponse {
  id: string;
  name: string;
  slug: string;
  is_page: boolean;
  status: StatusEnum;
  entries: IEntry[] | undefined

  constructor({
    id,
    name, 
    slug,
    entries
  }: ICollection) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.status = status;
    this.is_page = is_page;
    this.entries = entries;   
  }
}

export class EntryResponse {
  id: number;
  title: string;
  slug: string;
  id_collection: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  collection_name?: string;
  collection_slug?: string;

  constructor({
    id,
    title,
    slug,
    id_collection,
    status,
    createdAt,
    updatedAt,
    collection
  }: IEntry) {
    this.id = id;
    this.title = title;
    this.slug = slug;
    this.id_collection = id_collection;
    this.status = status;
    this.collection_name = collection?.name;
    this.collection_slug = collection?.slug;
    this.createdAt = createdAt ?? "";
    this.updatedAt = updatedAt ?? "";
  }
}
