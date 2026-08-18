import { CollectionType, ICollection, IDataSingle, IEntry, IField } from "~/admin/interfaces";

export class CollectionResponse {
  id: string;
  name: string;
  slug: string;
  type?: CollectionType;
  isMedia: boolean;
  fields?: IField[];
  createdAt?: string;
  entries?: IEntry[];
  entriesTotal?: number;
  entriesPage?: number;
  entriesPageSize?: number;
  dataSingle?: IDataSingle | null;

  constructor({
    id,
    name,
    slug,
    type,
    fields,
    createdAt,
    entries,
    isMedia,
    entriesTotal,
    entriesPage,
    entriesPageSize,
    dataSingle,
  }: ICollection) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.type = type;
    this.isMedia = isMedia;
    this.fields = fields;
    this.createdAt = createdAt;
    this.entries = entries;
    this.entriesTotal = entriesTotal;
    this.entriesPage = entriesPage;
    this.entriesPageSize = entriesPageSize;
    this.dataSingle = dataSingle;
  }
}
