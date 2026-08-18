import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPublicEntry } from "~/content/queries.server";
import { PublicLayout } from "~/content/PublicLayout";
import { getTemplate } from "~/content/templates/registry";

// Ruta genérica: /c/:slug/:entrySlug — detalle de cualquier entry, con el
// mismo esquema de templates que $slug._index.tsx.
export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.item
      ? `${data.item.entry.data.entry_name ?? data.item.entry.slug} — Sonrisa Total`
      : "Contenido — Sonrisa Total",
  },
];

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const item = await getPublicEntry(params.slug!, params.entrySlug!);
  if (!item) throw new Response("No encontrado", { status: 404 });
  return { item };
};

export default function GenericCollectionDetail() {
  const { item } = useLoaderData<typeof loader>();
  const { Detail } = getTemplate(item.collection.template);

  return (
    <PublicLayout>
      <Detail data={item} backHref={`/${item.collection.slug}`} backLabel={`Volver a ${item.collection.name}`} />
    </PublicLayout>
  );
}
