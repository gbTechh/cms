import { PrismaSingleton } from "../bd";
import { MediaRepository, IMedia, IMediaCreate, IMediaError } from "~/admin/interfaces";
import { CatchError, TError } from "~/admin/lib";
import { logger } from "~/admin/lib/logger.server";

const prisma = PrismaSingleton.getInstance();

const mapMedia = (m: any): IMedia => ({
  id: m.id,
  url: m.url,
  altText: m.altText ?? null,
  mimeType: m.mimeType,
  fileSize: m.fileSize ?? null,
  width: m.width ?? null,
  height: m.height ?? null,
  createdAt: m.createdAt.toISOString(),
});

export class PrismaMediaRepository implements MediaRepository {
  async getAll(pagination?: { page?: number; pageSize?: number }): Promise<{ media: IMedia[]; total: number }> {
    const page = Math.max(1, pagination?.page ?? 1);
    const pageSize = pagination?.pageSize ?? 60;

    const [data, total] = await Promise.all([
      prisma.media.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.media.count(),
    ]);

    return { media: data.map(mapMedia), total };
  }

  async getById(id: string): Promise<IMedia | null> {
    const data = await prisma.media.findUnique({ where: { id } });
    return data ? mapMedia(data) : null;
  }

  async create(input: IMediaCreate): Promise<{ error: TError<IMediaError> | null; media: IMedia | null }> {
    try {
      const media = await prisma.media.create({
        data: {
          url: input.url,
          altText: input.altText ?? null,
          mimeType: input.mimeType,
          fileSize: input.fileSize ?? null,
        },
      });
      return { error: null, media: mapMedia(media) };
    } catch (error) {
      logger.error({ err: error }, "Error al crear media");
      return { error: CatchError(error, "crear"), media: null };
    }
  }

  async update(id: string, data: { altText?: string }): Promise<{ error: TError<IMediaError> | null; media: IMedia | null }> {
    try {
      const media = await prisma.media.update({
        where: { id },
        data: { altText: data.altText ?? null },
      });
      return { error: null, media: mapMedia(media) };
    } catch (error) {
      logger.error({ err: error }, "Error al actualizar media");
      return { error: CatchError(error, "actualizar"), media: null };
    }
  }

  async delete(id: string): Promise<{ error: TError<IMediaError> | null }> {
    try {
      await prisma.media.delete({ where: { id } });
      return { error: null };
    } catch (error) {
      logger.error({ err: error }, "Error al eliminar media");
      return { error: CatchError(error, "eliminar") };
    }
  }
}
