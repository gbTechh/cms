import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CollectionSlug, FormSubmissionsPage, MediaPage, SingleEdit } from "~/admin/components";
import { deleteEntry, listCollectionBySlug, assertCsrf, updateDataSingle } from "~/admin/use_cases";
import { bulkDeleteMedia, deleteMediaById, listMedia, updateMediaById } from "~/admin/use_cases/media";
import { deleteFormSubmissionById, listFormSubmissions } from "~/admin/use_cases/forms";
import { ROUTES } from "~/admin/constants";

const isSingleType = (type?: string) => type === "global" || type === "page";

export const loader = async (ctx: LoaderFunctionArgs) => {
  const data = await listCollectionBySlug(ctx) as { collection: any };
  if (data.collection?.isMedia) {
    const url = new URL(ctx.request.url);
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const { media, total, pageSize } = await listMedia({ page });
    return { collection: data.collection, media, total, page, pageSize };
  }
  if (data.collection?.type === "form") {
    const url = new URL(ctx.request.url);
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const { submissions, total, pageSize } = await listFormSubmissions(data.collection.id, { page });
    return { collection: data.collection, submissions, total, page, pageSize };
  }
  return data;
};

export const action = async (ctx: ActionFunctionArgs) => {
  const { collection } = await listCollectionBySlug(ctx) as { collection: any };
  const formData = await ctx.request.formData();
  await assertCsrf(ctx.request, formData);

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

  if (isSingleType(collection?.type)) {
    const raw = formData.get("data") as string;
    const slug = (formData.get("slug") as string) || "";
    const data = raw ? JSON.parse(raw) : {};

    const result = await updateDataSingle(collection.id, slug, data);
    if ((result as any).error) return result;

    return redirect(`${ROUTES.COLLECTIONS}/${ctx.params.slug}`);
  }

  if (collection?.type === "form") {
    const id = formData.get("id") as string;
    return deleteFormSubmissionById(id);
  }

  const id = formData.get("id") as string;
  return deleteEntry(id, ctx.params.slug!);
};

export default function CollectionsSlugAdmin() {
  const loaderData = useLoaderData<typeof loader>();
  const { collection } = loaderData as any;
  if (collection?.isMedia) {
    const { media, total, page, pageSize } = loaderData as any;
    return (
      <MediaPage
        collection={collection}
        media={media ?? []}
        total={total}
        page={page}
        pageSize={pageSize}
      />
    );
  }
  if (isSingleType(collection?.type)) {
    return <SingleEdit data={collection} />;
  }
  if (collection?.type === "form") {
    const { submissions, total, page, pageSize } = loaderData as any;
    return (
      <FormSubmissionsPage
        collection={collection}
        submissions={submissions ?? []}
        total={total}
        page={page}
        pageSize={pageSize}
      />
    );
  }
  return <CollectionSlug data={collection} />;
}
