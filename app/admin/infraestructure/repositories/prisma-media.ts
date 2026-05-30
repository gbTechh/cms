import { PrismaSingleton } from "../bd";
import { MediaRepository, IMedia, IMediaCreate, IMediaError } from "~/admin/interfaces";
import { CatchError, TError } from "~/admin/lib";

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
  async getAll(): Promise<IMedia[]> {
    const data = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
    return data.map(mapMedia);
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
      return { error: CatchError(error, "actualizar"), media: null };
    }
  }

  async delete(id: string): Promise<{ error: TError<IMediaError> | null }> {
    try {
      await prisma.media.delete({ where: { id } });
      return { error: null };
    } catch (error) {
      return { error: CatchError(error, "eliminar") };
    }
  }
}
