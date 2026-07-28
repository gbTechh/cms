import {
  ActionFunctionArgs,
  redirect,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { MediaService } from "./service";
import { PrismaMediaRepository } from "~/admin/infraestructure";
import { ROUTES } from "~/admin/constants";
import { assertCsrf } from "~/admin/use_cases/auth";
import path from "node:path";
import fs from "node:fs/promises";

// Whitelist de mimeType -> extensiones permitidas. Solo se aceptan estos
// tipos porque son los únicos que la UI de medios sabe previsualizar
// (imagen, video, pdf); cualquier otro tipo (ej. .html, .svg, .js) se
// rechaza para evitar subir contenido ejecutable/XSS almacenado.
const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
};

export const uploadMedia = async ({ request, params }: ActionFunctionArgs) => {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  const formData = await unstable_parseMultipartFormData(
    request,
    unstable_createMemoryUploadHandler({ maxPartSize: 20_000_000 }),
  );
  await assertCsrf(request, formData);

  const altText = (formData.get("altText") as string | null) ?? undefined;
  const rawFiles = formData.getAll("files");
  const files = rawFiles.filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return { error: "No se recibieron archivos" };
  }

  const service = new MediaService(new PrismaMediaRepository());

  const rejected: string[] = [];
  let savedCount = 0;

  for (const file of files) {
    const declaredMime = file.type || "application/octet-stream";
    const rawExt = path.extname(file.name).toLowerCase();
    const ext = rawExt.replace(/[^a-z0-9.]/g, "");

    const allowedExts = ALLOWED_MIME_TYPES[declaredMime];
    if (!allowedExts || !allowedExts.includes(ext)) {
      rejected.push(file.name);
      continue;
    }

    if (savedCount === 0) await fs.mkdir(uploadsDir, { recursive: true });

    const base = path.basename(file.name, rawExt).replace(/[^a-zA-Z0-9._-]/g, "-");
    const savedName = `${Date.now()}-${base}${ext}`;
    const filePath = path.join(uploadsDir, savedName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    await service.create({
      url: `/uploads/${savedName}`,
      altText,
      mimeType: declaredMime,
      fileSize: file.size,
    });
    savedCount += 1;
  }

  if (savedCount === 0) {
    return {
      error: `Ningún archivo tiene un tipo permitido (jpg, png, gif, webp, pdf, mp4, webm): ${rejected.join(", ")}`,
    };
  }

  // Redirect back to the media collection list
  const slug = params.slug ?? "media";
  return redirect(`${ROUTES.COLLECTIONS}/${slug}`);
};
