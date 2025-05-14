import { ICollection, IEntry, IField } from "~/admin/interfaces";

export class CollectionResponse {
  id: string;
  name: string;
  slug: string;
  isMedia: boolean;
  fields?: IField[];
  createdAt?: string;
  entries?: IEntry[];

  constructor({
    id,
    name,
    slug,
    fields,
    createdAt,
    entries,
    isMedia,
  }: ICollection) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.isMedia = isMedia;
    this.fields = fields;
    this.createdAt = createdAt;
    this.entries = entries;
  }
}

export class EntryResponse {
  id: string;
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
    collection,
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
