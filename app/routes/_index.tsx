import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPublicCollection, getPublicSingle } from "~/content/queries.server";
import { PublicLayout } from "~/content/PublicLayout";
import { formatPrice } from "~/content/format";
import * as ui from "~/content/ui";

export const meta: MetaFunction = () => [
  { title: "Sonrisa Total — Odontología de confianza en Lima" },
  { name: "description", content: "Clínica dental con especialistas en ortodoncia, implantes y odontopediatría. Reserva tu cita y conoce nuestros casos." },
];

const TREATMENT_LABELS: Record<string, string> = {
  ortodoncia: "Ortodoncia",
  blanqueamiento: "Blanqueamiento",
  carillas: "Carillas",
  implantes: "Implantes",
  odontopediatria: "Odontopediatría",
  rehabilitacion: "Rehabilitación oral",
};

export const loader = async (_: LoaderFunctionArgs) => {
  const [services, portfolio, doctors, testimonials, faq, settings] = await Promise.all([
    getPublicCollection("services", { page: 1, pageSize: 3 }),
    getPublicCollection("portfolio", { page: 1, pageSize: 3 }),
    getPublicCollection("doctors", { page: 1, pageSize: 4 }),
    getPublicCollection("testimonials", { page: 1, pageSize: 3 }),
    getPublicCollection("faq", { page: 1, pageSize: 4 }),
    getPublicSingle("site-settings"),
  ]);
  return { services, portfolio, doctors, testimonials, faq, settings };
};

export default function Home() {
  const { services, portfolio, doctors, testimonials, faq, settings } = useLoaderData<typeof loader>();

  return (
    <PublicLayout>
      <section className="bg-gradient-to-br from-pub-text to-pub-accent text-white">
        <div className="mx-auto max-w-3xl px-8 pt-28 pb-20 text-center">
          <span className="mb-6 inline-block rounded-full bg-white/15 px-5 py-2 text-[1.2rem] font-bold tracking-wide uppercase">
            Clínica dental en Lima
          </span>
          <h1 className="mb-6 font-pub-display text-5xl font-semibold tracking-tight text-balance">
            Tu sonrisa, nuestra prioridad
          </h1>
          <p className="mx-auto mb-10 max-w-[52ch] text-[1.7rem] leading-relaxed opacity-90">
            Odontología general, ortodoncia, implantes y estética dental con especialistas dedicados a tu cuidado — y resultados reales que podés ver.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link
              to="/reservar"
              className="rounded-full bg-white px-9 py-4 text-[1.4rem] font-bold text-pub-text transition hover:-translate-y-px hover:opacity-90"
            >
              Reservar cita
            </Link>
            <Link
              to="/portfolio"
              className="rounded-full border-[1.5px] border-white/50 px-9 py-4 text-[1.4rem] font-bold text-white transition hover:border-white"
            >
              Ver nuestros casos
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-pub-border bg-pub-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-8 py-12 text-center sm:grid-cols-3">
          <div>
            <p className="font-pub-display text-[3.2rem] leading-none font-bold text-pub-accent">{settings?.yearsExperience ?? 15}+</p>
            <p className="mt-2 text-[1.3rem] text-pub-text-muted">Años de experiencia</p>
          </div>
          <div>
            <p className="font-pub-display text-[3.2rem] leading-none font-bold text-pub-accent">
              {Number(settings?.patientsCount ?? 3000).toLocaleString("es-PE")}+
            </p>
            <p className="mt-2 text-[1.3rem] text-pub-text-muted">Pacientes atendidos</p>
          </div>
          <div>
            <p className="font-pub-display text-[3.2rem] leading-none font-bold text-pub-accent">
              {Number(settings?.treatmentsCount ?? 5000).toLocaleString("es-PE")}+
            </p>
            <p className="mt-2 text-[1.3rem] text-pub-text-muted">Tratamientos realizados</p>
          </div>
        </div>
      </section>

      <section className={ui.section}>
        <div className={ui.sectionHead}>
          <h2 className={ui.sectionTitle}>Nuestro trabajo habla por sí solo</h2>
          <Link to="/portfolio" className={ui.sectionLink}>Ver todos los casos →</Link>
        </div>
        {portfolio && portfolio.entries.length > 0 ? (
          <div className={ui.grid}>
            {portfolio.entries.map((entry) => {
              const treatment = TREATMENT_LABELS[entry.data.treatmentType] ?? "Caso";
              return (
                <Link key={entry.id} to={`/portfolio/${entry.slug}`} className={ui.card}>
                  <div className={ui.artPlaceholder}>
                    <span className={ui.artPlaceholderLabel}>{treatment}</span>
                  </div>
                  <span className={ui.cardBadge}>{treatment}</span>
                  <h3 className={ui.cardTitle}>{entry.data.entry_name ?? "Caso"}</h3>
                  <p className={ui.cardExcerpt}>{String(entry.data.summary ?? "").slice(0, 110)}</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className={ui.empty}>Todavía no hay casos publicados.</p>
        )}
      </section>

      <section className={ui.sectionAlt}>
        <div className={ui.sectionHead}>
          <h2 className={ui.sectionTitle}>Servicios destacados</h2>
          <Link to="/services" className={ui.sectionLink}>Ver todos →</Link>
        </div>
        {services && services.entries.length > 0 ? (
          <div className={ui.grid}>
            {services.entries.map((entry) => (
              <Link key={entry.id} to={`/services/${entry.slug}`} className={ui.card}>
                <span className={ui.cardBadge}>{entry.data.category ?? "general"}</span>
                <h3 className={ui.cardTitle}>{entry.data.entry_name ?? "Servicio"}</h3>
                {entry.data.duration && <p className={ui.cardMeta}>{entry.data.duration}</p>}
                <p className={ui.cardPrice}>Desde {formatPrice(entry.data.price)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className={ui.empty}>Aún no hay servicios publicados.</p>
        )}
      </section>

      <section className={ui.section}>
        <div className={ui.sectionHead}>
          <h2 className={ui.sectionTitle}>Nuestro equipo</h2>
          <Link to="/doctors" className={ui.sectionLink}>Ver todos →</Link>
        </div>
        {doctors && doctors.entries.length > 0 ? (
          <div className={ui.grid}>
            {doctors.entries.map((entry) => {
              const name = entry.data.entry_name ?? "Especialista";
              const initials = name.replace(/^(Dr\.|Dra\.)\s*/i, "").split(" ").filter(Boolean).slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
              return (
                <Link key={entry.id} to={`/doctors/${entry.slug}`} className={ui.card}>
                  <div className={ui.avatar}>{initials}</div>
                  <h3 className={ui.cardTitle}>{name}</h3>
                  <p className={ui.cardMeta}>{entry.data.position}</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className={ui.empty}>Aún no hay especialistas publicados.</p>
        )}
      </section>

      <section className={ui.sectionAlt}>
        <div className={ui.sectionHead}>
          <h2 className={ui.sectionTitle}>Lo que dicen nuestros pacientes</h2>
          <Link to="/testimonials" className={ui.sectionLink}>Ver todos →</Link>
        </div>
        {testimonials && testimonials.entries.length > 0 ? (
          <div className={ui.grid}>
            {testimonials.entries.map((entry) => {
              const rating = Number(entry.data.rating) || 0;
              return (
                <Link key={entry.id} to={`/testimonials/${entry.slug}`} className={ui.card}>
                  <p className={ui.quoteMark}>“</p>
                  <p className={ui.cardExcerpt}>{String(entry.data.quote ?? "").slice(0, 140)}</p>
                  <p className={ui.stars}>{"★".repeat(rating)}{"☆".repeat(Math.max(0, 5 - rating))}</p>
                  <h3 className={ui.cardTitle}>{entry.data.entry_name ?? "Paciente"}</h3>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className={ui.empty}>Aún no hay testimonios publicados.</p>
        )}
      </section>

      <section className={ui.section}>
        <div className={ui.sectionHead}>
          <h2 className={ui.sectionTitle}>Preguntas frecuentes</h2>
          <Link to="/faq" className={ui.sectionLink}>Ver todas →</Link>
        </div>
        {faq && faq.entries.length > 0 ? (
          <div className="flex max-w-3xl flex-col gap-4">
            {faq.entries.map((entry) => (
              <details key={entry.id} className="group rounded-pub border border-pub-border bg-pub-surface px-7">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 text-[1.5rem] font-semibold [&::-webkit-details-marker]:hidden">
                  {entry.data.entry_name}
                  <span className="shrink-0 text-[1.8rem] text-pub-accent transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <p className="pb-7 text-[1.4rem] leading-relaxed text-pub-text-muted">
                  {Array.isArray(entry.data.answer)
                    ? entry.data.answer.map((block: any) => block.children?.map((c: any) => c.text).join("")).join(" ")
                    : String(entry.data.answer ?? "")}
                </p>
              </details>
            ))}
          </div>
        ) : (
          <p className={ui.empty}>Aún no hay preguntas publicadas.</p>
        )}
      </section>

      <div className="mx-auto max-w-6xl px-8 py-16">
        <div className="rounded-[calc(var(--radius-pub)+0.4rem)] bg-gradient-to-br from-pub-text to-pub-accent px-12 py-16 text-center text-white">
          <h2 className="mb-4 font-pub-display text-[2.8rem] font-semibold">¿Listo para tu próxima sonrisa?</h2>
          <p className="mb-8 text-[1.5rem] opacity-90">Reservá tu cita hoy y te confirmamos en menos de 24 horas.</p>
          <Link
            to="/reservar"
            className="inline-block rounded-full bg-white px-9 py-4 text-[1.4rem] font-bold text-pub-text transition hover:opacity-90"
          >
            Reservar cita
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
