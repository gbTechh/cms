import { ICollection, IEntry, IField } from "~/admin/interfaces";

export class CollectionResponse {
  id: string;
  name: string;
  slug: string;
  isMedia: boolean;
  fields?: IField[];
  createdAt?: string;
  entries?: IEntry[];
  entriesTotal?: number;
  entriesPage?: number;
  entriesPageSize?: number;

  constructor({
    id,
    name,
    slug,
    fields,
    createdAt,
    entries,
    isMedia,
    entriesTotal,
    entriesPage,
    entriesPageSize,
  }: ICollection) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.isMedia = isMedia;
    this.fields = fields;
    this.createdAt = createdAt;
    this.entries = entries;
    this.entriesTotal = entriesTotal;
    this.entriesPage = entriesPage;
    this.entriesPageSize = entriesPageSize;
  }
}
