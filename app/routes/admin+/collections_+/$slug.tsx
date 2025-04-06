import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CollectionSlug } from "~/admin/components";
import { listCollectionBySlug } from "~/admin/use_cases";

export const loader = async (ctx: LoaderFunctionArgs) => {
  return listCollectionBySlug(ctx);
};

export default function CollectionsSlugAdmin() {
  const { collection } = useLoaderData<typeof loader>();
  return <CollectionSlug data={collection!} />;
}
