import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getEntries, getSingle } from "~/frontend/data/client.server";
import { Layout } from "~/frontend/templates/Layout";
export { links } from "~/frontend/templates/Layout";
import {
  Section,
  SectionHeader,
  Grid,
  EmptyState,
  CardLink,
  CardArt,
  Stat,
  Heading,
  Text,
  ButtonLink,
} from "~/frontend/ui";

export const meta: MetaFunction = () => [
  { title: "Spa — Bienestar y cuidado personal" },
  { name: "description", content: "Tratamientos faciales, corporales y de relajación con especialistas dedicados a tu bienestar." },
];

export const loader = async (_: LoaderFunctionArgs) => {
  const [treatments, settings] = await Promise.all([
    getEntries("treatments", { page: 1, pageSize: 6 }),
    getSingle("site-settings"),
  ]);
  return { treatments, settings };
};

export default function Home() {
  const { treatments, settings } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <section className="bg-gradient-to-br from-pub-text to-pub-accent text-white">
        <div className="mx-auto max-w-3xl px-8 pt-28 pb-20 text-center">
          <span className="mb-6 inline-block rounded-full bg-white/15 px-5 py-2 text-[1.2rem] font-bold tracking-wide uppercase">
            Spa & Bienestar
          </span>
          <Heading as="h1" size="xl" className="mb-6 font-semibold text-white text-balance">
            Tu momento de calma
          </Heading>
          <Text className="mx-auto mb-10 max-w-[52ch] text-[1.7rem] text-white/90">
            Tratamientos faciales, corporales y de relajación pensados para desconectar y cuidar tu bienestar.
          </Text>
          <div className="flex flex-wrap justify-center gap-5">
            <ButtonLink to="/treatments" variant="inverse">Ver tratamientos</ButtonLink>
          </div>
        </div>
      </section>

      <section className="border-b border-pub-border bg-pub-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-8 py-12 sm:grid-cols-3">
          <Stat value={`${settings?.yearsExperience ?? 10}+`} label="Años de experiencia" />
          <Stat value={`${Number(settings?.patientsCount ?? 2000).toLocaleString("es-PE")}+`} label="Clientes atendidos" />
          <Stat value={`${Number(settings?.treatmentsCount ?? 4000).toLocaleString("es-PE")}+`} label="Tratamientos realizados" />
        </div>
      </section>

      <Section>
        <SectionHeader title="Nuestros tratamientos" action={{ label: "Ver todos →", to: "/treatments" }} />
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
      </Section>

      <div className="mx-auto max-w-6xl px-8 py-16">
        <div className="rounded-[calc(var(--radius-pub)+0.4rem)] bg-gradient-to-br from-pub-text to-pub-accent px-12 py-16 text-center text-white">
          <Heading as="h2" size="lg" className="mb-4 font-semibold text-white">¿Lista/o para tu momento de bienestar?</Heading>
          <Text className="mb-8 text-[1.5rem] text-white/90">Descubrí el tratamiento perfecto para vos.</Text>
          <ButtonLink to="/treatments" variant="inverse">Ver tratamientos</ButtonLink>
        </div>
      </div>
    </Layout>
  );
}
