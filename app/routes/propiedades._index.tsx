import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPublicCollection } from "~/content/queries.server";
import { PublicLayout } from "~/content/PublicLayout";
import { formatPrice } from "~/content/format";
import cards from "~/content/cards.module.css";

export const meta: MetaFunction = () => [{ title: "Propiedades — CasaNova" }];

const PAGE_SIZE = 9;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const properties = await getPublicCollection("properties", { page, pageSize: PAGE_SIZE });
  return { properties };
};

export default function PropertiesList() {
  const { properties } = useLoaderData<typeof loader>();

  if (!properties) {
    return (
      <PublicLayout>
        <div className={cards.section}>
          <p className={cards.empty}>Esta sección todavía no está disponible.</p>
        </div>
      </PublicLayout>
    );
  }

  const totalPages = Math.max(1, Math.ceil(properties.total / properties.pageSize));

  return (
    <PublicLayout>
      <div className={cards.section}>
        <div className={cards.sectionHead}>
          <h1 className={cards.sectionTitle}>Propiedades</h1>
        </div>

        {properties.entries.length === 0 ? (
          <p className={cards.empty}>Aún no hay propiedades publicadas.</p>
        ) : (
          <div className={cards.grid}>
            {properties.entries.map((entry) => (
              <Link key={entry.id} to={`/propiedades/${entry.slug}`} className={cards.card}>
                <span className={cards.cardBadge}>{entry.data.operation ?? "venta"}</span>
                <h3 className={cards.cardTitle}>{entry.data.entry_name ?? "Propiedad"}</h3>
                <p className={cards.cardMeta}>{entry.data.address}</p>
                <p className={cards.cardMeta}>
                  {entry.data.bedrooms ?? "—"} hab · {entry.data.bathrooms ?? "—"} baños · {entry.data.area ?? "—"} m²
                </p>
                <p className={cards.cardPrice}>{formatPrice(entry.data.price)}</p>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className={cards.pagination}>
            <Link
              to={`/propiedades?page=${properties.page - 1}`}
              className={`${cards.pageLink} ${properties.page <= 1 ? cards.pageLinkDisabled : ""}`}
            >
              Anterior
            </Link>
            <Link
              to={`/propiedades?page=${properties.page + 1}`}
              className={`${cards.pageLink} ${properties.page >= totalPages ? cards.pageLinkDisabled : ""}`}
            >
              Siguiente
            </Link>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
