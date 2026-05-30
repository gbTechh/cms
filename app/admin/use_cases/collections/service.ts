import { Mapped, TError } from "~/admin/lib";
import { CollectionResponse } from "./response";
import { CollectionRepository, ICollection, IEntryError } from "~/admin/interfaces";

export class CollectionService extends Mapped<CollectionResponse, ICollection> {
  private collection: CollectionRepository;

  constructor(collection: CollectionRepository) {
    super(CollectionResponse);
    this.collection = collection;
  }

  async getJustCollections() {
    const collections = await this.collection.getJustCollections();
    return collections.map((c) => this.mapped(c));
  }

  async getCollections() {
    const collections = await this.collection.getAllCollections();
    return collections.map((c) => this.mapped(c));
  }

  async getCollectionBySlug(slug: string | undefined) {
    if (!slug) return null;
    const collection = await this.collection.getCollectionBySlug(slug);
    return collection ? this.mapped(collection) : null;
  }

  async getEntryById(id: string) {
    return this.collection.getEntryById(id);
  }

  async createEntry(collectionId: string, data: Record<string, any>) {
    const slug = data["entry_slug"];
    if (slug) {
      const existing = await this.collection.findEntryBySlug(collectionId, slug);
      if (existing) {
        return {
          error: {
            hasError: true,
            message: "El slug ya está en uso en esta colección",
            body: { entry_slug: "Este slug ya existe, elige uno diferente" },
          } as TError<IEntryError>,
          entry: null,
        };
      }
    }
    return this.collection.createEntry({ collectionId, data });
  }

  async updateEntry(id: string, collectionId: string, data: Record<string, any>) {
    const slug = data["entry_slug"];
    if (slug && collectionId) {
      const existing = await this.collection.findEntryBySlug(collectionId, slug, id);
      if (existing) {
        return {
          error: {
            hasError: true,
            message: "El slug ya está en uso en esta colección",
            body: { entry_slug: "Este slug ya existe, elige uno diferente" },
          } as TError<IEntryError>,
          entry: null,
        };
      }
    }
    return this.collection.updateEntry(id, data);
  }

  async deleteEntry(id: string) {
    return this.collection.deleteEntry(id);
  }
}
