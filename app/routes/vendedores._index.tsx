import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPublicCollection } from "~/content/queries.server";
import { PublicLayout } from "~/content/PublicLayout";
import cards from "~/content/cards.module.css";

export const meta: MetaFunction = () => [{ title: "Vendedores — CasaNova" }];

const PAGE_SIZE = 12;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const sellers = await getPublicCollection("sellers", { page, pageSize: PAGE_SIZE });
  return { sellers };
};

export default function SellersList() {
  const { sellers } = useLoaderData<typeof loader>();

  if (!sellers) {
    return (
      <PublicLayout>
        <div className={cards.section}>
          <p className={cards.empty}>Esta sección todavía no está disponible.</p>
        </div>
      </PublicLayout>
    );
  }

  const totalPages = Math.max(1, Math.ceil(sellers.total / sellers.pageSize));

  return (
    <PublicLayout>
      <div className={cards.section}>
        <div className={cards.sectionHead}>
          <h1 className={cards.sectionTitle}>Nuestro equipo</h1>
        </div>

        {sellers.entries.length === 0 ? (
          <p className={cards.empty}>Aún no hay vendedores publicados.</p>
        ) : (
          <div className={cards.grid}>
            {sellers.entries.map((entry) => (
              <Link key={entry.id} to={`/vendedores/${entry.slug}`} className={cards.card}>
                <h3 className={cards.cardTitle}>{entry.data.entry_name ?? "Vendedor"}</h3>
                <p className={cards.cardMeta}>{entry.data.position}</p>
                {entry.data.email && <p className={cards.cardMeta}>{entry.data.email}</p>}
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className={cards.pagination}>
            <Link
              to={`/vendedores?page=${sellers.page - 1}`}
              className={`${cards.pageLink} ${sellers.page <= 1 ? cards.pageLinkDisabled : ""}`}
            >
              Anterior
            </Link>
            <Link
              to={`/vendedores?page=${sellers.page + 1}`}
              className={`${cards.pageLink} ${sellers.page >= totalPages ? cards.pageLinkDisabled : ""}`}
            >
              Siguiente
            </Link>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
