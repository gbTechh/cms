import { Prisma } from "@prisma/client";
import { PrismaSingleton } from "../bd";
import {
  CollectionRepository,
  ICollection,
  IEntry,
  IEntryCreate,
  IEntryError,
  IField,
} from "~/admin/interfaces";
import { CatchError, TError } from "~/admin/lib";

const prisma = PrismaSingleton.getInstance();

const mapEntry = (entry: any): IEntry => ({
  ...entry,
  data: entry.data as Record<string, any>,
  createdAt: entry.createdAt.toISOString(),
  relationshipsFrom: entry.relationshipsFrom ?? [],
  relationshipsTo: entry.relationshipsTo ?? [],
});

export class PrismaCollectionsRepository implements CollectionRepository {
  async getJustCollections(): Promise<ICollection[]> {
    const data = await prisma.collection.findMany({
      orderBy: { id: "desc" },
      where: { deletedAt: null },
    });
    return data.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      fields: c.fields as unknown as IField[],
    }));
  }

  async getAllCollections(): Promise<ICollection[]> {
    const data = await prisma.collection.findMany({
      orderBy: { id: "desc" },
      where: { deletedAt: null },
      include: {
        entries: {
          include: { relationshipsFrom: true, relationshipsTo: true },
        },
      },
    });
    return data.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      fields: c.fields as unknown as IField[],
      entries: c.entries.map(mapEntry),
    }));
  }

  async getCollectionBySlug(slug: string): Promise<ICollection | null> {
    const data = await prisma.collection.findUnique({
      where: { slug },
      include: {
        entries: {
          include: { relationshipsFrom: true, relationshipsTo: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!data) return null;
    return {
      ...data,
      createdAt: data.createdAt.toISOString(),
      fields: data.fields as unknown as IField[],
      entries: data.entries.map(mapEntry),
    };
  }

  async findEntryBySlug(collectionId: string, slug: string, excludeId?: string): Promise<IEntry | null> {
    const data = await prisma.entry.findFirst({
      where: {
        collectionId,
        data: { path: ["entry_slug"], equals: slug },
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      include: { relationshipsFrom: true, relationshipsTo: true },
    });
    return data ? mapEntry(data) : null;
  }

  async getEntryById(id: string): Promise<IEntry | null> {
    const data = await prisma.entry.findUnique({
      where: { id },
      include: { relationshipsFrom: true, relationshipsTo: true },
    });
    if (!data) return null;
    return mapEntry(data);
  }

  async createEntry(input: IEntryCreate): Promise<{
    error: TError<IEntryError> | null;
    entry: IEntry | null;
  }> {
    try {
      const entry = await prisma.entry.create({
        data: {
          collectionId: input.collectionId,
          data: input.data as Prisma.JsonObject,
        },
        include: { relationshipsFrom: true, relationshipsTo: true },
      });
      return { error: null, entry: mapEntry(entry) };
    } catch (error) {
      return { error: CatchError(error, "crear"), entry: null };
    }
  }

  async updateEntry(id: string, data: Record<string, any>): Promise<{
    error: TError<IEntryError> | null;
    entry: IEntry | null;
  }> {
    try {
      const entry = await prisma.entry.update({
        where: { id },
        data: { data: data as Prisma.JsonObject },
        include: { relationshipsFrom: true, relationshipsTo: true },
      });
      return { error: null, entry: mapEntry(entry) };
    } catch (error) {
      return { error: CatchError(error, "actualizar"), entry: null };
    }
  }

  async deleteEntry(id: string): Promise<{
    error: TError<IEntryError> | null;
    entry: IEntry | null;
  }> {
    try {
      const entry = await prisma.entry.delete({
        where: { id },
        include: { relationshipsFrom: true, relationshipsTo: true },
      });
      return { error: null, entry: mapEntry(entry) };
    } catch (error) {
      return { error: CatchError(error, "eliminar"), entry: null };
    }
  }
}
