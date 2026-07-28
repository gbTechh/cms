import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPublicEntry } from "~/content/queries.server";
import { PublicLayout } from "~/content/PublicLayout";
import { RichTextView } from "~/content/RichTextView";
import { formatDate } from "~/content/format";
import detail from "~/content/detail.module.css";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.post ? `${data.post.entry.data.entry_name} — CasaNova` : "Blog — CasaNova" },
];

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const post = await getPublicEntry("blogs", params.entrySlug!);
  if (!post) throw new Response("Artículo no encontrado", { status: 404 });
  return { post };
};

export default function BlogDetail() {
  const { post } = useLoaderData<typeof loader>();
  const { entry } = post;

  return (
    <PublicLayout>
      <div className={detail.wrap}>
        <Link to="/blog" className={detail.back}>← Volver al blog</Link>

        <div className={detail.header}>
          <h1 className={detail.title}>{entry.data.entry_name ?? "Artículo"}</h1>
          <p className={detail.subtitle}>
            {formatDate(entry.data.meta_published_at || entry.createdAt)}
            {entry.data.meta_author ? ` · ${entry.data.meta_author}` : ""}
          </p>
        </div>

        <RichTextView value={entry.data.content} className={detail.content} />
      </div>
    </PublicLayout>
  );
}
