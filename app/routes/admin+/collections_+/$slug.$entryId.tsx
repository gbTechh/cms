import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { EntryNew } from "~/admin/components";
import { getEntryById, listCollectionBySlug, updateEntry } from "~/admin/use_cases";

export const loader = async (ctx: LoaderFunctionArgs) => {
  const collectionData = await listCollectionBySlug(ctx) as { collection: any };
  const entry = await getEntryById(ctx.params.entryId!);
  return { collection: collectionData.collection, entry };
};

export const action = async (ctx: ActionFunctionArgs) => {
  return updateEntry(ctx);
};

export default function CollectionEditEntryAdmin() {
  const { collection, entry } = useLoaderData<typeof loader>();
  return <EntryNew data={collection!} entry={entry ?? undefined} />;
}
