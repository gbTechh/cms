import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { EntryNew, MediaNew } from "~/admin/components";
import { listCollectionBySlug } from "~/admin/use_cases";

export const loader = async (ctx: LoaderFunctionArgs) => {
  return listCollectionBySlug(ctx);
};

export default function CollectionNewAdmin() {
  const { collection } = useLoaderData<typeof loader>();
  console.log({collection})
  return (
    <>
      {
        collection?.isMedia ? (<MediaNew data={collection!} />) : (<EntryNew data={collection!}/>)
      }
    </>
  );
}
