import {
  ActionFunctionArgs,
  redirect,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { MediaService } from "./service";
import { PrismaMediaRepository } from "~/admin/infraestructure";
import { ROUTES } from "~/admin/constants";
import path from "node:path";
import fs from "node:fs/promises";

export const uploadMedia = async ({ request, params }: ActionFunctionArgs) => {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  const formData = await unstable_parseMultipartFormData(
    request,
    unstable_createMemoryUploadHandler({ maxPartSize: 20_000_000 }),
  );

  const altText = (formData.get("altText") as string | null) ?? undefined;
  const rawFiles = formData.getAll("files");
  const files = rawFiles.filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return { error: "No se recibieron archivos" };
  }

  await fs.mkdir(uploadsDir, { recursive: true });

  const service = new MediaService(new PrismaMediaRepository());

  for (const file of files) {
    const ext = path.extname(file.name);
    const base = path.basename(file.name, ext).replace(/[^a-zA-Z0-9._-]/g, "-");
    const savedName = `${Date.now()}-${base}${ext}`;
    const filePath = path.join(uploadsDir, savedName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    await service.create({
      url: `/uploads/${savedName}`,
      altText,
      mimeType: file.type || "application/octet-stream",
      fileSize: file.size,
    });
  }

  // Redirect back to the media collection list
  const slug = params.slug ?? "media";
  return redirect(`${ROUTES.COLLECTIONS}/${slug}`);
};
