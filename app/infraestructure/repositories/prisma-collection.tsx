import { Prisma } from "@prisma/client";
import { PrismaSingleton } from "../bd";
import { ICollection, IField } from "~/interfaces";

const prisma = PrismaSingleton.getInstance();

export class PrismaCollectionsRepository implements PrismaCollectionsRepository {
  async getAllCollections(): Promise<ICollection[] | []> {
    const data = await prisma.collection.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        entries: {
          include: {
            relationshipsFrom: true,
            relationshipsTo: true,
          }
        },
      },
    });

    const result = data.map(collection => ({
        ...collection,
        createdAt: collection.createdAt.toISOString(), 
        fields: collection.fields as unknown as IField,
        entries: collection.entries.map(entry => ({
          ...entry,
          data: entry.data as Record<string, any>,
          createdAt: entry.createdAt.toISOString(), 
        })),
      }));
      
    return result;
  }
  async getCollectionBySlug(slug: string): Promise<ICollection | null> {
    const data = await prisma.collection.findUnique({
      where: {
        slug,
      },
      include: {
        entries: true,
      },
    });
    if (data) {
      const result: ICollection = {
        ...data,
        entries: data.entries.map((e) => {
          return {
            ...e,
            createdAt: e.createdAt.toISOString(),
            updatedAt: e.updatedAt.toISOString(),
          };
        }),
      };
      return result;
    } else {
      return null;
    }
  }
  async getEntryBySlug(slug: string): Promise<IEntry | null> {
    const data = await prisma.entry.findUnique({
      where: {
        slug,
      },
      include: {
        collection: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });
    if (data) {
      const result: IEntry = {
        ...data,
        createdAt: data.createdAt.toISOString(),
        updatedAt: data.updatedAt.toISOString(),
      }
      return result;
    } else {
      return null;
    }
  }

  async createCollection(data: ICollectionCreate): Promise<{
    error: TError<ICollectionError> | null;
    collection: ICollection | null;
  }> {
    try {
      const collection = await prisma.collection.create({ data });
      if (collection) {
        return { error: null, collection };
      } else {
        return { error: null, collection: null };
      }
    } catch (error) {
      return { error: CatchError(error), collection: null };
    } finally {
      prisma.$disconnect();
    }
  }
  async updateCollection(
    data: ICollectionCreate,
    slug: string
  ): Promise<{
    error: TError<ICollectionError> | null;
    collection: ICollection | null;
  }> {
    try {
      const collection = await prisma.collection.update({
        data: data,
        where: {
          slug: slug,
        },
      });
      if (collection) {
        return { error: null, collection };
      } else {
        return { error: null, collection: null };
      }
    } catch (error) {
      return { error: CatchError(error, 'actualizar'), collection: null };
    } finally {
      prisma.$disconnect();
    }
  }
  async createEntry(
    data: IEntryCreate
  ): Promise<{ error: TError<IEntryError> | null; entry: IEntry | null }> {
    try {
      const entry = await prisma.entry.create({ data });
      if (entry) {
        const result: IEntry = {
          ...entry,
          createdAt: entry.createdAt.toISOString(),
          updatedAt: entry.updatedAt.toISOString(),
        };
        return { error: null, entry: result };
      } else {
        return { error: null, entry: null };
      }
    } catch (error) {
      return { error: CatchError(error, 'crear'), entry: null };
    } finally {
      prisma.$disconnect();
    }
  }
  async deleteCollection(id: number): Promise<{
    error: TError<ICollectionError> | null;
    collection: ICollection | null;
  }> {
    try {
      const collection = await prisma.collection.delete({
        where: {
          id: id,
        },
      });
      if (collection) {
        return { error: null, collection };
      } else {
        return { error: null, collection: null };
      }
    } catch (error) {
      return { error: CatchError(error, 'eliminar'), collection: null };
    } finally {
      prisma.$disconnect();
    }
  }
  async deleteEntry(id: number): Promise<{
    error: TError<IEntryError> | null;
    entry: IEntry | null;
  }> {
    try {
      const entry = await prisma.entry.delete({
        where: {
          id: id,
        },
      });
      if (entry) {
        const result: IEntry = {
          ...entry,
          createdAt: entry.createdAt.toISOString(),
          updatedAt: entry.updatedAt.toISOString(),
        };
        return { error: null, entry: result };
      } else {
        return { error: null, entry: null };
      }
    } catch (error) {
      return { error: CatchError(error, 'eliminar'), entry: null };
    } finally {
      prisma.$disconnect();
    }
  }
}