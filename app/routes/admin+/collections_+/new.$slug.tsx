import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { EntryNew } from "~/admin/components";
import { listCollectionBySlug } from "~/admin/use_cases";

export const loader = async (ctx: LoaderFunctionArgs) => {
  return listCollectionBySlug(ctx);
};

export default function CollectionNewAdmin() {
  const { collection } = useLoaderData<typeof loader>();
  return <EntryNew data={collection!} />;
}
