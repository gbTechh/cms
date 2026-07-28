import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPublicCollection } from "~/content/queries.server";
import { PublicLayout } from "~/content/PublicLayout";
import { formatDate } from "~/content/format";
import { slateToPlainText } from "~/admin/lib";
import cards from "~/content/cards.module.css";

export const meta: MetaFunction = () => [{ title: "Blog — CasaNova" }];

const PAGE_SIZE = 9;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const blogs = await getPublicCollection("blogs", { page, pageSize: PAGE_SIZE });
  return { blogs };
};

export default function BlogList() {
  const { blogs } = useLoaderData<typeof loader>();

  if (!blogs) {
    return (
      <PublicLayout>
        <div className={cards.section}>
          <p className={cards.empty}>Esta sección todavía no está disponible.</p>
        </div>
      </PublicLayout>
    );
  }

  const totalPages = Math.max(1, Math.ceil(blogs.total / blogs.pageSize));

  return (
    <PublicLayout>
      <div className={cards.section}>
        <div className={cards.sectionHead}>
          <h1 className={cards.sectionTitle}>Blog</h1>
        </div>

        {blogs.entries.length === 0 ? (
          <p className={cards.empty}>Aún no hay artículos publicados.</p>
        ) : (
          <div className={cards.grid}>
            {blogs.entries.map((entry) => (
              <Link key={entry.id} to={`/blog/${entry.slug}`} className={cards.card}>
                <h3 className={cards.cardTitle}>{entry.data.entry_name ?? "Artículo"}</h3>
                <p className={cards.cardMeta}>{formatDate(entry.data.meta_published_at || entry.createdAt)}</p>
                <p className={cards.cardExcerpt}>
                  {slateToPlainText(entry.data.content).slice(0, 140)}
                </p>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className={cards.pagination}>
            <Link
              to={`/blog?page=${blogs.page - 1}`}
              className={`${cards.pageLink} ${blogs.page <= 1 ? cards.pageLinkDisabled : ""}`}
            >
              Anterior
            </Link>
            <Link
              to={`/blog?page=${blogs.page + 1}`}
              className={`${cards.pageLink} ${blogs.page >= totalPages ? cards.pageLinkDisabled : ""}`}
            >
              Siguiente
            </Link>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
