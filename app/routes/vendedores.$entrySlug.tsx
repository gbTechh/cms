import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPublicEntry } from "~/content/queries.server";
import { PublicLayout } from "~/content/PublicLayout";
import { RichTextView } from "~/content/RichTextView";
import detail from "~/content/detail.module.css";
import cards from "~/content/cards.module.css";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.seller ? `${data.seller.entry.data.entry_name} — CasaNova` : "Vendedor — CasaNova" },
];

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const seller = await getPublicEntry("sellers", params.entrySlug!);
  if (!seller) throw new Response("Vendedor no encontrado", { status: 404 });
  return { seller };
};

export default function SellerDetail() {
  const { seller } = useLoaderData<typeof loader>();
  const { entry } = seller;
  const properties = seller.referencedBy.filter((r) => r.type === "seller" && r.collectionSlug === "properties");

  return (
    <PublicLayout>
      <div className={detail.wrap}>
        <Link to="/vendedores" className={detail.back}>← Volver al equipo</Link>

        <div className={detail.header}>
          <h1 className={detail.title}>{entry.data.entry_name ?? "Vendedor"}</h1>
          <p className={detail.subtitle}>{entry.data.position}</p>
          {(entry.data.phone || entry.data.email) && (
            <p className={detail.subtitle}>
              {[entry.data.phone, entry.data.email].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        <RichTextView value={entry.data.bio} className={detail.content} />

        {properties.length > 0 && (
          <div className={detail.referencedSection}>
            <div className={cards.sectionHead}>
              <h2 className={cards.sectionTitle}>Propiedades a cargo</h2>
            </div>
            <div className={cards.grid}>
              {properties.map((p) => (
                <Link key={p.id} to={`/propiedades/${p.slug}`} className={cards.card}>
                  <h3 className={cards.cardTitle}>{p.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
