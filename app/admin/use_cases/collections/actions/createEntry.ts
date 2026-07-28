import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { CollectionService } from "../service";
import { PrismaCollectionsRepository } from "~/admin/infraestructure";
import { ROUTES } from "~/admin/constants";
import { assertCsrf } from "~/admin/use_cases/auth";

export const createEntry = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  await assertCsrf(request, formData);
  const raw = formData.get("data") as string;
  const collectionId = formData.get("collectionId") as string;
  const data = raw ? JSON.parse(raw) : {};

  const service = new CollectionService(new PrismaCollectionsRepository());
  const result = await service.createEntry(collectionId, data);

  if (result.error?.hasError) {
    return { error: result.error };
  }

  return redirect(`${ROUTES.COLLECTIONS}/${params.slug}`);
};
