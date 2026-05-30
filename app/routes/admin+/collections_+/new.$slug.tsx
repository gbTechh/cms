import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { EntryNew, MediaNew } from "~/admin/components";
import { createEntry, listCollectionBySlug } from "~/admin/use_cases";
import { uploadMedia } from "~/admin/use_cases/media";

export const loader = async (ctx: LoaderFunctionArgs) => {
  return listCollectionBySlug(ctx);
};

export const action = async (ctx: ActionFunctionArgs) => {
  const { collection } = await listCollectionBySlug(ctx) as { collection: any };
  if (collection?.isMedia) return uploadMedia(ctx);
  return createEntry(ctx);
};

export default function CollectionNewAdmin() {
  const { collection } = useLoaderData<typeof loader>();
  return collection?.isMedia
    ? <MediaNew collection={collection!} />
    : <EntryNew data={collection!} />;
}
