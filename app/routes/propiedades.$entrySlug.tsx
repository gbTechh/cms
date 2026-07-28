import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPublicEntry } from "~/content/queries.server";
import { PublicLayout } from "~/content/PublicLayout";
import { RichTextView } from "~/content/RichTextView";
import { formatPrice } from "~/content/format";
import detail from "~/content/detail.module.css";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.property ? `${data.property.entry.data.entry_name} — CasaNova` : "Propiedad — CasaNova" },
];

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const property = await getPublicEntry("properties", params.entrySlug!);
  if (!property) throw new Response("Propiedad no encontrada", { status: 404 });
  return { property };
};

export default function PropertyDetail() {
  const { property } = useLoaderData<typeof loader>();
  const { entry } = property;
  const seller = property.relatedTo.find((r) => r.type === "seller");

  return (
    <PublicLayout>
      <div className={detail.wrap}>
        <Link to="/propiedades" className={detail.back}>← Volver a propiedades</Link>

        <div className={detail.header}>
          <span className={detail.badge}>{entry.data.operation ?? "venta"}</span>
          <h1 className={detail.title}>{entry.data.entry_name ?? "Propiedad"}</h1>
          <p className={detail.subtitle}>{entry.data.address}</p>
          <p className={detail.price}>{formatPrice(entry.data.price)}</p>
        </div>

        <div className={detail.layout}>
          <div>
            <div className={detail.specs}>
              <div className={detail.spec}>
                <span className={detail.specValue}>{entry.data.bedrooms ?? "—"}</span>
                <span className={detail.specLabel}>Habitaciones</span>
              </div>
              <div className={detail.spec}>
                <span className={detail.specValue}>{entry.data.bathrooms ?? "—"}</span>
                <span className={detail.specLabel}>Baños</span>
              </div>
              <div className={detail.spec}>
                <span className={detail.specValue}>{entry.data.area ?? "—"}</span>
                <span className={detail.specLabel}>m²</span>
              </div>
              <div className={detail.spec}>
                <span className={detail.specValue}>{entry.data.propertyType ?? "—"}</span>
                <span className={detail.specLabel}>Tipo</span>
              </div>
            </div>
            <RichTextView value={entry.data.description} className={detail.content} />
          </div>

          {seller && (
            <aside className={detail.sidebar}>
              <p className={detail.sidebarLabel}>Vendedor a cargo</p>
              <Link to={`/vendedores/${seller.slug}`} className={detail.sidebarLink}>
                <p className={detail.sidebarName}>{seller.name}</p>
                <p className={detail.sidebarMeta}>Ver perfil →</p>
              </Link>
            </aside>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
