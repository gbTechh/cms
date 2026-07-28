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
import { logger } from "~/admin/lib/logger.server";

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

  async getCollectionBySlug(
    slug: string,
    pagination?: { page?: number; pageSize?: number }
  ): Promise<ICollection | null> {
    const page = Math.max(1, pagination?.page ?? 1);
    const pageSize = pagination?.pageSize ?? 50;

    const data = await prisma.collection.findUnique({
      where: { slug },
      include: {
        entries: {
          include: { relationshipsFrom: true, relationshipsTo: true },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        },
      },
    });
    if (!data) return null;

    const entriesTotal = await prisma.entry.count({
      where: { collectionId: data.id },
    });

    return {
      ...data,
      createdAt: data.createdAt.toISOString(),
      fields: data.fields as unknown as IField[],
      entries: data.entries.map(mapEntry),
      entriesTotal,
      entriesPage: page,
      entriesPageSize: pageSize,
    };
  }

  async getCollectionById(id: string): Promise<ICollection | null> {
    const data = await prisma.collection.findUnique({ where: { id } });
    if (!data) return null;
    return {
      ...data,
      createdAt: data.createdAt.toISOString(),
      fields: data.fields as unknown as IField[],
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
      include: {
        relationshipsFrom: { include: { toEntry: { select: { id: true, data: true } } } },
        relationshipsTo: { include: { fromEntry: { select: { id: true, data: true } } } },
      },
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
      logger.error({ err: error }, "Error al crear entry");
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
      logger.error({ err: error }, "Error al actualizar entry");
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
      logger.error({ err: error }, "Error al eliminar entry");
      return { error: CatchError(error, "eliminar"), entry: null };
    }
  }

  async listEntryOptions(slug: string): Promise<{ value: string; label: string }[]> {
    const entries = await prisma.entry.findMany({
      where: { collection: { slug } },
      select: { id: true, data: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return entries.map((e) => {
      const data = e.data as Record<string, any>;
      return {
        value: e.id,
        label: data?.entry_name || data?.entry_slug || e.id,
      };
    });
  }

  async countValidEntryIds(slug: string, ids: string[]): Promise<number> {
    if (ids.length === 0) return 0;
    return prisma.entry.count({
      where: { id: { in: ids }, collection: { slug } },
    });
  }

  async syncRelationships(fromEntryId: string, type: string, toEntryIds: string[]): Promise<void> {
    await prisma.$transaction([
      prisma.relationship.deleteMany({ where: { fromEntryId, type } }),
      ...(toEntryIds.length > 0
        ? [
            prisma.relationship.createMany({
              data: toEntryIds.map((toEntryId) => ({ fromEntryId, toEntryId, type })),
            }),
          ]
        : []),
    ]);
  }
}
