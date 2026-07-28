import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPublicCollection } from "~/content/queries.server";
import { PublicLayout } from "~/content/PublicLayout";
import { formatPrice } from "~/content/format";
import { slateToPlainText } from "~/admin/lib";
import cards from "~/content/cards.module.css";
import styles from "~/content/home.module.css";

export const meta: MetaFunction = () => [
  { title: "CasaNova — Encuentra tu próximo hogar" },
  { name: "description", content: "Propiedades en venta y alquiler, con asesores dedicados a ayudarte a encontrar tu próximo hogar." },
];

export const loader = async (_: LoaderFunctionArgs) => {
  const [properties, sellers, blogs] = await Promise.all([
    getPublicCollection("properties", { page: 1, pageSize: 3 }),
    getPublicCollection("sellers", { page: 1, pageSize: 3 }),
    getPublicCollection("blogs", { page: 1, pageSize: 3 }),
  ]);
  return { properties, sellers, blogs };
};

export default function Home() {
  const { properties, sellers, blogs } = useLoaderData<typeof loader>();

  return (
    <PublicLayout>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Encuentra el hogar que estás buscando</h1>
          <p className={styles.heroSubtitle}>
            Casas, departamentos y terrenos seleccionados por nuestro equipo de asesores.
          </p>
          <Link to="/propiedades" className={styles.heroCta}>
            Ver propiedades
          </Link>
        </div>
      </section>

      <section className={cards.section}>
        <div className={cards.sectionHead}>
          <h2 className={cards.sectionTitle}>Propiedades destacadas</h2>
          <Link to="/propiedades" className={cards.sectionLink}>Ver todas →</Link>
        </div>
        {properties && properties.entries.length > 0 ? (
          <div className={cards.grid}>
            {properties.entries.map((entry) => (
              <Link key={entry.id} to={`/propiedades/${entry.slug}`} className={cards.card}>
                <span className={cards.cardBadge}>{entry.data.operation ?? "venta"}</span>
                <h3 className={cards.cardTitle}>{entry.data.entry_name ?? "Propiedad"}</h3>
                <p className={cards.cardMeta}>{entry.data.address}</p>
                <p className={cards.cardPrice}>{formatPrice(entry.data.price)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className={cards.empty}>Aún no hay propiedades publicadas.</p>
        )}
      </section>

      <section className={cards.section}>
        <div className={cards.sectionHead}>
          <h2 className={cards.sectionTitle}>Nuestro equipo</h2>
          <Link to="/vendedores" className={cards.sectionLink}>Ver todos →</Link>
        </div>
        {sellers && sellers.entries.length > 0 ? (
          <div className={cards.grid}>
            {sellers.entries.map((entry) => (
              <Link key={entry.id} to={`/vendedores/${entry.slug}`} className={cards.card}>
                <h3 className={cards.cardTitle}>{entry.data.entry_name ?? "Vendedor"}</h3>
                <p className={cards.cardMeta}>{entry.data.position}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className={cards.empty}>Aún no hay vendedores publicados.</p>
        )}
      </section>

      <section className={cards.section}>
        <div className={cards.sectionHead}>
          <h2 className={cards.sectionTitle}>Del blog</h2>
          <Link to="/blog" className={cards.sectionLink}>Ver todos →</Link>
        </div>
        {blogs && blogs.entries.length > 0 ? (
          <div className={cards.grid}>
            {blogs.entries.map((entry) => (
              <Link key={entry.id} to={`/blog/${entry.slug}`} className={cards.card}>
                <h3 className={cards.cardTitle}>{entry.data.entry_name ?? "Artículo"}</h3>
                <p className={cards.cardExcerpt}>
                  {slateToPlainText(entry.data.content).slice(0, 140)}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className={cards.empty}>Aún no hay artículos publicados.</p>
        )}
      </section>
    </PublicLayout>
  );
}
