import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPublicCollection } from "~/content/queries.server";
import { PublicLayout } from "~/content/PublicLayout";
import { getTemplate } from "~/content/templates/registry";
import * as ui from "~/content/ui";

// Ruta genérica: /:slug — lista cualquier colección type "collection" sin
// necesidad de escribir una ruta a mano. El "look" de la card lo decide el
// campo `template` de la colección (ver app/content/templates/registry.tsx);
// sin template asignado, usa el renderer "default" genérico.
//
// Sin prefijo (antes era /c/:slug) porque no hace falta: `Collection.slug`
// es @unique en el schema (collections, singles y forms comparten la misma
// tabla), así que nunca puede haber una colección con el mismo slug que
// otra. Lo único reservado son las rutas escritas a mano (/admin, /forms,
// la home) — Remix ya les da prioridad sobre esta ruta dinámica porque un
// segmento estático siempre puntúa más alto que uno dinámico ($slug) al
// resolver qué ruta matchea. getPublicCollection además solo sirve type
// "collection" (los singles/forms devuelven null → "no disponible"), así
// que ni pisándose el slug con un single/form pasaría algo raro.
const PAGE_SIZE = 12;

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.collection ? `${data.collection.name} — Sonrisa Total` : "Contenido — Sonrisa Total" },
];

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const collection = await getPublicCollection(params.slug!, { page, pageSize: PAGE_SIZE });
  return { collection };
};

export default function GenericCollectionList() {
  const { collection } = useLoaderData<typeof loader>();

  if (!collection) {
    return (
      <PublicLayout>
        <div className={ui.section}>
          <p className={ui.empty}>Esta sección todavía no está disponible.</p>
        </div>
      </PublicLayout>
    );
  }

  const { Card } = getTemplate(collection.template);
  const totalPages = Math.max(1, Math.ceil(collection.total / collection.pageSize));

  return (
    <PublicLayout>
      <div className={ui.section}>
        <div className={ui.sectionHead}>
          <h1 className={ui.sectionTitle}>{collection.name}</h1>
        </div>

        {collection.entries.length === 0 ? (
          <p className={ui.empty}>Aún no hay contenido publicado.</p>
        ) : (
          <div className={ui.grid}>
            {collection.entries.map((entry) => (
              <Card
                key={entry.id}
                entry={entry}
                fields={collection.fields}
                href={`/${collection.slug}/${entry.slug}`}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className={ui.pagination}>
            <Link
              to={`/${collection.slug}?page=${collection.page - 1}`}
              className={`${ui.pageLink} ${collection.page <= 1 ? ui.pageLinkDisabled : ""}`}
            >
              Anterior
            </Link>
            <Link
              to={`/${collection.slug}?page=${collection.page + 1}`}
              className={`${ui.pageLink} ${collection.page >= totalPages ? ui.pageLinkDisabled : ""}`}
            >
              Siguiente
            </Link>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
