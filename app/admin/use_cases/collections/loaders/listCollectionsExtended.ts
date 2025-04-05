import { redirect, TypedResponse } from "@remix-run/node";
import { CollectionResponse } from "../response";
import { CollectionService } from "../service";
import { PrismaCollectionsRepository } from "~/admin/infraestructure";

interface ResponseData {
  collections: CollectionResponse[]
}

export const listCollectionsExtended = async (
  request: Request
): Promise<ResponseData | TypedResponse<never>> => {
  // const hasPermission = await verifyRolAndAuth(request, MODULES_CODE.CATEGORY);
  // if (!hasPermission) {
  //   return redirect(ROUTES.BIENVENIDA);
  // }

  const collection = new CollectionService(new PrismaCollectionsRepository());
  const data = await collection.getCollections();


  return {
    collections: data,
  };
};