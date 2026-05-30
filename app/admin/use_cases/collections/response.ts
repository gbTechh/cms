import { ICollection, IEntry, IField } from "~/admin/interfaces";

export class CollectionResponse {
  id: string;
  name: string;
  slug: string;
  isMedia: boolean;
  fields?: IField[];
  createdAt?: string;
  entries?: IEntry[];

  constructor({ id, name, slug, fields, createdAt, entries, isMedia }: ICollection) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.isMedia = isMedia;
    this.fields = fields;
    this.createdAt = createdAt;
    this.entries = entries;
  }
}
