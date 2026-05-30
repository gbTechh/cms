import { MediaService } from "./service";
import { PrismaMediaRepository } from "~/admin/infraestructure";
import fs from "node:fs/promises";
import path from "node:path";

export const deleteMediaById = async (id: string): Promise<null> => {
  const service = new MediaService(new PrismaMediaRepository());
  const media = await service.getById(id);
  if (media) {
    try {
      await fs.unlink(path.join(process.cwd(), "public", media.url));
    } catch {
      // File may already be missing from disk
    }
    await service.delete(id);
  }
  return null;
};

export const bulkDeleteMedia = async (ids: string[]): Promise<null> => {
  await Promise.all(ids.map((id) => deleteMediaById(id)));
  return null;
};
