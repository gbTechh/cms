import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getEntry } from "~/frontend/data/client.server";
import { Layout } from "~/frontend/templates/Layout";
export { links } from "~/frontend/templates/Layout";
import { LinkText, Heading, Text, Grid, CardLink, CardArt, EmptyState, SectionHeader, Price } from "~/frontend/ui";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data ? `${data.entry.data.entry_name} — Spa` : "Tratamiento — Spa" },
];

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const item = await getEntry("treatments", params.entrySlug!);
  if (!item) throw new Response("No encontrado", { status: 404 });
  return item;
};

export default function TreatmentDetail() {
  const { entry, referencedBy } = useLoaderData<typeof loader>();
  // Los items que apuntan a esta categoría vía su campo "treatment"
  // (relación inversa) — mismo patrón que doctors <- services.doctor.
  const items = referencedBy.filter((r) => r.type === "treatment");

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-8 pt-12 pb-20">
        <LinkText to="/treatments" variant="muted" textClassName="font-semibold hover:text-pub-accent" className="mb-6 inline-block">
          ← Volver a Tratamientos
        </LinkText>
        {entry.data.image && (
          <div className="mb-8 aspect-[21/9] overflow-hidden rounded-pub">
            <img src={entry.data.image} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <Heading as="h1" size="xl" className="mb-8">{entry.data.entry_name}</Heading>

        <SectionHeader title="Tratamientos en esta categoría" />
        {items.length > 0 ? (
          <Grid>
            {items.map((item) => (
              <CardLink key={item.id} to={`/treatment-items/${item.slug}`}>
                <CardArt>
                  <span className="px-6 text-center font-pub-display text-[1.9rem] font-bold text-white/90">
                    {item.name}
                  </span>
                </CardArt>
                <Heading as="h3" size="sm">{item.name}</Heading>
              </CardLink>
            ))}
          </Grid>
        ) : (
          <EmptyState>Aún no hay tratamientos publicados en esta categoría.</EmptyState>
        )}
      </div>
    </Layout>
  );
}
