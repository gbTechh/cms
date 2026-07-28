import { LoaderFunctionArgs, TypedResponse } from "@remix-run/node";
import { CollectionResponse } from "../response";
import { CollectionService } from "../service";
import { PrismaCollectionsRepository } from "~/admin/infraestructure";

interface ResponseData {
  collection: CollectionResponse | null;
}

export const listCollectionBySlug = async ({
  request,
  params,
}: LoaderFunctionArgs): Promise<ResponseData | TypedResponse<never>> => {
  // const hasPermission = await verifyRolAndAuth(request, MODULES_CODE.CATEGORY);
  // if (!hasPermission) {
  //   return redirect(ROUTES.BIENVENIDA);
  // }

  const { slug } = params;
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);

  const collection = new CollectionService(new PrismaCollectionsRepository());
  const data = await collection.getCollectionBySlug(slug, { page });

  return {
    collection: data,
  };
};
