import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CollectionSlug, MediaPage } from "~/admin/components";
import { deleteEntry, listCollectionBySlug } from "~/admin/use_cases";
import { bulkDeleteMedia, deleteMediaById, listMedia, updateMediaById } from "~/admin/use_cases/media";

export const loader = async (ctx: LoaderFunctionArgs) => {
  const data = await listCollectionBySlug(ctx) as { collection: any };
  if (data.collection?.isMedia) {
    const { media } = await listMedia();
    return { collection: data.collection, media };
  }
  return data;
};

export const action = async (ctx: ActionFunctionArgs) => {
  const { collection } = await listCollectionBySlug(ctx) as { collection: any };
  const formData = await ctx.request.formData();

  if (collection?.isMedia) {
    const _action = formData.get("_action") as string;
    const id = formData.get("id") as string;
    if (_action === "delete") return deleteMediaById(id);
    if (_action === "bulkDelete") {
      const ids = JSON.parse(formData.get("ids") as string) as string[];
      return bulkDeleteMedia(ids);
    }
    if (_action === "update") {
      const altText = formData.get("altText") as string;
      return updateMediaById(id, altText);
    }
    return null;
  }

  const id = formData.get("id") as string;
  return deleteEntry(id, ctx.params.slug!);
};

export default function CollectionsSlugAdmin() {
  const loaderData = useLoaderData<typeof loader>();
  const { collection } = loaderData as any;
  if (collection?.isMedia) {
    const { media } = loaderData as any;
    return <MediaPage collection={collection} media={media ?? []} />;
  }
  return <CollectionSlug data={collection} />;
}
