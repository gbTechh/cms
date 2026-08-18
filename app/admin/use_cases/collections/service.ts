import { Mapped, TError, coerceEntryData, validateEntryData } from "~/admin/lib";
import { CollectionResponse } from "./response";
import { CollectionRepository, ICollection, IEntryError, IField } from "~/admin/interfaces";

const relationshipFieldsOf = (collection: ICollection) =>
  (collection.fields ?? []).filter(
    (f): f is Extract<IField, { type: "relationship" }> => f.type === "relationship"
  );

const idsFromValue = (raw: unknown): string[] => {
  if (raw === undefined || raw === null || raw === "") return [];
  const arr = Array.isArray(raw) ? raw : [raw];
  return arr.filter((v): v is string => typeof v === "string" && v.length > 0);
};

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

  async getCollectionBySlug(
    slug: string | undefined,
    pagination?: { page?: number; pageSize?: number }
  ) {
    if (!slug) return null;
    const collection = await this.collection.getCollectionBySlug(slug, pagination);
    return collection ? this.mapped(collection) : null;
  }

  async getEntryById(id: string) {
    return this.collection.getEntryById(id);
  }

  async listEntryOptions(slug: string) {
    return this.collection.listEntryOptions(slug);
  }

  private async validateRelationshipReferences(
    collection: ICollection,
    data: Record<string, any>
  ): Promise<string | null> {
    for (const field of relationshipFieldsOf(collection)) {
      const ids = idsFromValue(data[field.name]);
      if (ids.length === 0) continue;

      const count = await this.collection.countValidEntryIds(field.relationTo, ids);
      if (count !== ids.length) {
        return `"${field.label}" hace referencia a elementos que ya no existen`;
      }
    }
    return null;
  }

  private async syncEntryRelationships(collection: ICollection, entryId: string, data: Record<string, any>) {
    for (const field of relationshipFieldsOf(collection)) {
      const ids = idsFromValue(data[field.name]);
      await this.collection.syncRelationships(entryId, field.name, ids);
    }
  }

  async createEntry(collectionId: string, data: Record<string, any>) {
    const collection = await this.collection.getCollectionById(collectionId);
    if (!collection) {
      return {
        error: {
          hasError: true,
          message: "La colección no existe",
          body: undefined,
        } as TError<IEntryError>,
        entry: null,
      };
    }

    const coercedData = coerceEntryData(collection.fields, data);

    const validation = validateEntryData(collection.fields, coercedData);
    if (!validation.success) {
      return {
        error: {
          hasError: true,
          message: "Datos inválidos",
          body: { data: validation.errors.map((e) => e.message).join("; ") },
        } as TError<IEntryError>,
        entry: null,
      };
    }

    const relationshipError = await this.validateRelationshipReferences(collection, coercedData);
    if (relationshipError) {
      return {
        error: {
          hasError: true,
          message: relationshipError,
          body: { data: relationshipError },
        } as TError<IEntryError>,
        entry: null,
      };
    }

    const slug = coercedData["entry_slug"];
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

    const result = await this.collection.createEntry({ collectionId, data: coercedData });
    if (!result.error && result.entry) {
      await this.syncEntryRelationships(collection, result.entry.id, coercedData);
    }
    return result;
  }

  async updateEntry(id: string, collectionId: string, data: Record<string, any>) {
    const collection = await this.collection.getCollectionById(collectionId);
    if (!collection) {
      return {
        error: {
          hasError: true,
          message: "La colección no existe",
          body: undefined,
        } as TError<IEntryError>,
        entry: null,
      };
    }

    const coercedData = coerceEntryData(collection.fields, data);

    const validation = validateEntryData(collection.fields, coercedData);
    if (!validation.success) {
      return {
        error: {
          hasError: true,
          message: "Datos inválidos",
          body: { data: validation.errors.map((e) => e.message).join("; ") },
        } as TError<IEntryError>,
        entry: null,
      };
    }

    const relationshipError = await this.validateRelationshipReferences(collection, coercedData);
    if (relationshipError) {
      return {
        error: {
          hasError: true,
          message: relationshipError,
          body: { data: relationshipError },
        } as TError<IEntryError>,
        entry: null,
      };
    }

    const slug = coercedData["entry_slug"];
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

    const result = await this.collection.updateEntry(id, coercedData);
    if (!result.error && result.entry) {
      await this.syncEntryRelationships(collection, id, coercedData);
    }
    return result;
  }

  async deleteEntry(id: string) {
    return this.collection.deleteEntry(id);
  }

  async updateDataSingle(collectionId: string, slug: string, data: Record<string, any>) {
    const collection = await this.collection.getCollectionById(collectionId);
    if (!collection) {
      return {
        error: {
          hasError: true,
          message: "La colección no existe",
          body: undefined,
        } as TError<IEntryError>,
        dataSingle: null,
      };
    }

    const coercedData = coerceEntryData(collection.fields, data);

    const validation = validateEntryData(collection.fields, coercedData);
    if (!validation.success) {
      return {
        error: {
          hasError: true,
          message: "Datos inválidos",
          body: { data: validation.errors.map((e) => e.message).join("; ") },
        } as TError<IEntryError>,
        dataSingle: null,
      };
    }

    return this.collection.upsertDataSingle(collectionId, slug || collection.slug, coercedData);
  }
}
