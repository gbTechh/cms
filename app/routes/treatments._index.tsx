import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getEntries } from "~/frontend/data/client.server";
import { Layout } from "~/frontend/templates/Layout";
export { links } from "~/frontend/templates/Layout";
import { Section, Heading, Grid, EmptyState, Pagination, CardLink, CardArt } from "~/frontend/ui";

const PAGE_SIZE = 12;

export const meta: MetaFunction = () => [{ title: "Tratamientos — Spa" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const page = Math.max(1, Number(new URL(request.url).searchParams.get("page")) || 1);
  const treatments = await getEntries("treatments", { page, pageSize: PAGE_SIZE });
  return { treatments };
};

export default function TreatmentsList() {
  const { treatments } = useLoaderData<typeof loader>();
  const totalPages = treatments ? Math.max(1, Math.ceil(treatments.total / treatments.pageSize)) : 1;

  return (
    <Layout>
      <Section>
        <Heading as="h1" size="lg" className="mb-8">Tratamientos</Heading>
        {treatments && treatments.entries.length > 0 ? (
          <Grid>
            {treatments.entries.map((entry) => (
              <CardLink key={entry.id} to={`/treatments/${entry.slug}`}>
                <CardArt>
                  {entry.data.image ? (
                    <img src={entry.data.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="px-6 text-center font-pub-display text-[1.9rem] font-bold text-white/90">
                      {entry.data.entry_name}
                    </span>
                  )}
                </CardArt>
                <Heading as="h3" size="sm">{entry.data.entry_name ?? "Categoría"}</Heading>
              </CardLink>
            ))}
          </Grid>
        ) : (
          <EmptyState>Aún no hay tratamientos publicados.</EmptyState>
        )}
        {treatments && <Pagination page={treatments.page} totalPages={totalPages} hrefFor={(p) => `/treatments?page=${p}`} />}
      </Section>
    </Layout>
  );
}
