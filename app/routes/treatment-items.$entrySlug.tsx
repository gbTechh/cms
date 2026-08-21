import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getEntry } from "~/frontend/data/client.server";
import { Layout } from "~/frontend/templates/Layout";
export { links } from "~/frontend/templates/Layout";
import { LinkText, Badge, Heading, Text, Price, Grid, SectionHeader, EmptyState } from "~/frontend/ui";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data ? `${data.entry.data.entry_name} — Spa` : "Tratamiento — Spa" },
];

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const item = await getEntry("treatment-items", params.entrySlug!);
  if (!item) throw new Response("No encontrado", { status: 404 });
  return item;
};

export default function TreatmentItemDetail() {
  const { entry, relatedTo } = useLoaderData<typeof loader>();
  const category = relatedTo.find((r) => r.type === "treatment");
  const benefits: { image?: string; title?: string; description?: string }[] = entry.data.benefits ?? [];

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-8 pt-12 pb-20">
        <LinkText
          to={category ? `/treatments/${category.slug}` : "/treatments"}
          variant="muted"
          textClassName="font-semibold hover:text-pub-accent"
          className="mb-6 inline-block"
        >
          ← Volver a {category?.name ?? "Tratamientos"}
        </LinkText>

        {entry.data.image && (
          <div className="mb-8 aspect-[16/9] overflow-hidden rounded-pub">
            <img src={entry.data.image} alt="" className="h-full w-full object-cover" />
          </div>
        )}

        <div className="mb-8">
          {category && <Badge variant="outline">{category.name}</Badge>}
          <Heading as="h1" size="xl" className="mt-2">{entry.data.entry_name}</Heading>
          <Text className="mt-4 text-[1.6rem]" variant="muted">{entry.data.shortDescription}</Text>
          <Price value={entry.data.price} size="lg" className="mt-4 block" />
        </div>

        <SectionHeader title="Beneficios" />
        {benefits.length > 0 ? (
          <Grid>
            {benefits.map((b, i) => (
              <div key={i} className="rounded-pub border border-pub-border bg-pub-surface p-7">
                {b.image && (
                  <div className="-mx-7 -mt-7 mb-5 aspect-[4/3] overflow-hidden rounded-t-[calc(var(--radius-pub)-0.2rem)]">
                    <img src={b.image} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
                <Heading as="h3" size="sm">{b.title}</Heading>
                {b.description && <Text variant="muted" className="mt-2">{b.description}</Text>}
              </div>
            ))}
          </Grid>
        ) : (
          <EmptyState>Este tratamiento todavía no tiene beneficios cargados.</EmptyState>
        )}
      </div>
    </Layout>
  );
}
