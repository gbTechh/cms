import type { ReactElement } from "react";
import { Link } from "@remix-run/react";
import type { IField } from "~/admin/interfaces";
import type { PublicEntry, PublicEntryDetail } from "~/content/queries.server";
import { RichTextView } from "~/content/RichTextView";
import { slateToPlainText } from "~/admin/lib";
import { formatDate, formatPrice } from "~/content/format";
import * as ui from "~/content/ui";

export interface CardProps {
  entry: PublicEntry;
  fields: IField[];
  href: string;
}

export interface DetailProps {
  data: PublicEntryDetail;
  backHref: string;
  backLabel: string;
}

export interface CollectionTemplate {
  Card: (props: CardProps) => ReactElement;
  Detail: (props: DetailProps) => ReactElement;
}

// ── default: genérico, sirve para cualquier colección nueva sin curar ──
// Muestra el título + hasta 3 campos "simples" en la card, y en el detalle
// separa los richText del resto de campos (mostrados como specs).
const isSimpleField = (f: IField) =>
  f.type === "text" || f.type === "number" || f.type === "date" || f.type === "select" || f.type === "radio";

function DefaultCard({ entry, fields, href }: CardProps) {
  const metaFields = fields.filter(isSimpleField).slice(0, 3);
  return (
    <Link to={href} className={ui.card}>
      <h3 className={ui.cardTitle}>{entry.data.entry_name ?? entry.slug}</h3>
      {metaFields.map((f) => (
        <p key={f.name} className={ui.cardMeta}>
          {String(entry.data[f.name] ?? "—")}
        </p>
      ))}
    </Link>
  );
}

function DefaultDetail({ data, backHref, backLabel }: DetailProps) {
  const { entry, collection } = data;
  const specFields = collection.fields.filter(isSimpleField);
  const richTextFields = collection.fields.filter((f) => f.type === "richText");

  return (
    <div className={ui.detailWrap}>
      <Link to={backHref} className={ui.detailBack}>
        ← {backLabel}
      </Link>
      <div className={ui.detailHeader}>
        <h1 className={ui.detailTitle}>{entry.data.entry_name ?? entry.slug}</h1>
      </div>
      {specFields.length > 0 && (
        <div className={ui.detailSpecs}>
          {specFields.map((f) => (
            <div key={f.name} className={ui.detailSpec}>
              <span className={ui.detailSpecValue}>{String(entry.data[f.name] ?? "—")}</span>
              <span className={ui.detailSpecLabel}>{f.label}</span>
            </div>
          ))}
        </div>
      )}
      {richTextFields.map((f) => (
        <RichTextView key={f.name} value={entry.data[f.name]} className={ui.detailContent} />
      ))}
    </div>
  );
}

// ── properties: precio, operación, specs, vendedor a cargo (vertical
// real-estate, hoy sin collections activas — ver templates/demo-real-estate.json) ──
function PropertiesCard({ entry, href }: CardProps) {
  return (
    <Link to={href} className={ui.card}>
      <span className={ui.cardBadge}>{entry.data.operation ?? "venta"}</span>
      <h3 className={ui.cardTitle}>{entry.data.entry_name ?? "Propiedad"}</h3>
      <p className={ui.cardMeta}>{entry.data.address}</p>
      <p className={ui.cardMeta}>
        {entry.data.bedrooms ?? "—"} hab · {entry.data.bathrooms ?? "—"} baños · {entry.data.area ?? "—"} m²
      </p>
      <p className={ui.cardPrice}>{formatPrice(entry.data.price)}</p>
    </Link>
  );
}

function PropertiesDetail({ data, backHref, backLabel }: DetailProps) {
  const { entry } = data;
  const seller = data.relatedTo.find((r) => r.type === "seller");

  return (
    <div className={ui.detailWrap}>
      <Link to={backHref} className={ui.detailBack}>
        ← {backLabel}
      </Link>
      <div className={ui.detailHeader}>
        <span className={ui.detailBadge}>{entry.data.operation ?? "venta"}</span>
        <h1 className={ui.detailTitle}>{entry.data.entry_name ?? "Propiedad"}</h1>
        <p className={ui.detailSubtitle}>{entry.data.address}</p>
        <p className={ui.detailPrice}>{formatPrice(entry.data.price)}</p>
      </div>
      <div className={ui.detailLayout}>
        <div>
          <div className={ui.detailSpecs}>
            <div className={ui.detailSpec}>
              <span className={ui.detailSpecValue}>{entry.data.bedrooms ?? "—"}</span>
              <span className={ui.detailSpecLabel}>Habitaciones</span>
            </div>
            <div className={ui.detailSpec}>
              <span className={ui.detailSpecValue}>{entry.data.bathrooms ?? "—"}</span>
              <span className={ui.detailSpecLabel}>Baños</span>
            </div>
            <div className={ui.detailSpec}>
              <span className={ui.detailSpecValue}>{entry.data.area ?? "—"}</span>
              <span className={ui.detailSpecLabel}>m²</span>
            </div>
            <div className={ui.detailSpec}>
              <span className={ui.detailSpecValue}>{entry.data.propertyType ?? "—"}</span>
              <span className={ui.detailSpecLabel}>Tipo</span>
            </div>
          </div>
          <RichTextView value={entry.data.description} className={ui.detailContent} />
        </div>
        {seller && (
          <aside className={ui.detailSidebar}>
            <p className={ui.detailSidebarLabel}>Vendedor a cargo</p>
            <Link to={`/${seller.collectionSlug}/${seller.slug}`} className={ui.detailSidebarLink}>
              <p className={ui.detailSidebarName}>{seller.name}</p>
              <p className={ui.detailSidebarMeta}>Ver perfil →</p>
            </Link>
          </aside>
        )}
      </div>
    </div>
  );
}

// ── sellers: cargo/contacto + propiedades a cargo (relación inversa) ──
function SellersCard({ entry, href }: CardProps) {
  return (
    <Link to={href} className={ui.card}>
      <h3 className={ui.cardTitle}>{entry.data.entry_name ?? "Vendedor"}</h3>
      <p className={ui.cardMeta}>{entry.data.position}</p>
      {entry.data.email && <p className={ui.cardMeta}>{entry.data.email}</p>}
    </Link>
  );
}

function SellersDetail({ data, backHref, backLabel }: DetailProps) {
  const { entry } = data;
  const referenced = data.referencedBy.filter((r) => r.type === "seller");

  return (
    <div className={ui.detailWrap}>
      <Link to={backHref} className={ui.detailBack}>
        ← {backLabel}
      </Link>
      <div className={ui.detailHeader}>
        <h1 className={ui.detailTitle}>{entry.data.entry_name ?? "Vendedor"}</h1>
        <p className={ui.detailSubtitle}>{entry.data.position}</p>
        {(entry.data.phone || entry.data.email) && (
          <p className={ui.detailSubtitle}>{[entry.data.phone, entry.data.email].filter(Boolean).join(" · ")}</p>
        )}
      </div>
      <RichTextView value={entry.data.bio} className={ui.detailContent} />
      {referenced.length > 0 && (
        <div className={ui.referencedSection}>
          <div className={ui.sectionHead}>
            <h2 className={ui.sectionTitle}>A cargo</h2>
          </div>
          <div className={ui.grid}>
            {referenced.map((r) => (
              <Link key={r.id} to={`/${r.collectionSlug}/${r.slug}`} className={ui.card}>
                <h3 className={ui.cardTitle}>{r.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── blogPost: fecha/autor + contenido richText ──
function BlogPostCard({ entry, href }: CardProps) {
  return (
    <Link to={href} className={ui.card}>
      <h3 className={ui.cardTitle}>{entry.data.entry_name ?? "Artículo"}</h3>
      <p className={ui.cardMeta}>{formatDate(entry.data.meta_published_at || entry.createdAt)}</p>
      <p className={ui.cardExcerpt}>{slateToPlainText(entry.data.content).slice(0, 140)}</p>
    </Link>
  );
}

function BlogPostDetail({ data, backHref, backLabel }: DetailProps) {
  const { entry } = data;
  return (
    <div className={ui.detailWrap}>
      <Link to={backHref} className={ui.detailBack}>
        ← {backLabel}
      </Link>
      <div className={ui.detailHeader}>
        <h1 className={ui.detailTitle}>{entry.data.entry_name ?? "Artículo"}</h1>
        <p className={ui.detailSubtitle}>
          {formatDate(entry.data.meta_published_at || entry.createdAt)}
          {entry.data.meta_author ? ` · ${entry.data.meta_author}` : ""}
        </p>
      </div>
      <RichTextView value={entry.data.content} className={ui.detailContent} />
    </div>
  );
}

// ── dentistService: precio, duración, especialista a cargo (relación) ──
function DentistServiceCard({ entry, href }: CardProps) {
  return (
    <Link to={href} className={ui.card}>
      <span className={ui.cardBadge}>{entry.data.category ?? "general"}</span>
      <h3 className={ui.cardTitle}>{entry.data.entry_name ?? "Servicio"}</h3>
      {entry.data.duration && <p className={ui.cardMeta}>{entry.data.duration}</p>}
      <p className={ui.cardPrice}>Desde {formatPrice(entry.data.price)}</p>
    </Link>
  );
}

function DentistServiceDetail({ data, backHref, backLabel }: DetailProps) {
  const { entry } = data;
  const doctor = data.relatedTo.find((r) => r.type === "doctor");

  return (
    <div className={ui.detailWrap}>
      <Link to={backHref} className={ui.detailBack}>
        ← {backLabel}
      </Link>
      <div className={ui.detailHeader}>
        <span className={ui.detailBadge}>{entry.data.category ?? "general"}</span>
        <h1 className={ui.detailTitle}>{entry.data.entry_name ?? "Servicio"}</h1>
        <p className={ui.detailPrice}>Desde {formatPrice(entry.data.price)}</p>
      </div>
      <div className={ui.detailLayout}>
        <div>
          {entry.data.duration && (
            <div className={ui.detailSpecs}>
              <div className={ui.detailSpec}>
                <span className={ui.detailSpecValue}>{entry.data.duration}</span>
                <span className={ui.detailSpecLabel}>Duración aproximada</span>
              </div>
            </div>
          )}
          <RichTextView value={entry.data.description} className={ui.detailContent} />
        </div>
        {doctor && (
          <aside className={ui.detailSidebar}>
            <p className={ui.detailSidebarLabel}>Especialista a cargo</p>
            <Link to={`/${doctor.collectionSlug}/${doctor.slug}`} className={ui.detailSidebarLink}>
              <p className={ui.detailSidebarName}>{doctor.name}</p>
              <p className={ui.detailSidebarMeta}>Ver perfil →</p>
            </Link>
          </aside>
        )}
      </div>
    </div>
  );
}

// ── dentistDoctor: especialidad + servicios a cargo (relación inversa) ──
const initialsOf = (name: string) =>
  name
    .replace(/^(Dr\.|Dra\.)\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

function DentistDoctorCard({ entry, href }: CardProps) {
  const name = entry.data.entry_name ?? "Especialista";
  return (
    <Link to={href} className={ui.card}>
      <div className={ui.avatar}>{initialsOf(name)}</div>
      <h3 className={ui.cardTitle}>{name}</h3>
      <p className={ui.cardMeta}>{entry.data.position}</p>
    </Link>
  );
}

function DentistDoctorDetail({ data, backHref, backLabel }: DetailProps) {
  const { entry } = data;
  const services = data.referencedBy.filter((r) => r.type === "doctor");
  const name = entry.data.entry_name ?? "Especialista";

  return (
    <div className={ui.detailWrap}>
      <Link to={backHref} className={ui.detailBack}>
        ← {backLabel}
      </Link>
      <div className={ui.detailHeader}>
        <div className={ui.avatarLg}>{initialsOf(name)}</div>
        <h1 className={ui.detailTitle}>{name}</h1>
        <p className={ui.detailSubtitle}>{entry.data.position}</p>
        {(entry.data.phone || entry.data.email) && (
          <p className={ui.detailSubtitle}>{[entry.data.phone, entry.data.email].filter(Boolean).join(" · ")}</p>
        )}
      </div>
      <RichTextView value={entry.data.bio} className={ui.detailContent} />
      {services.length > 0 && (
        <div className={ui.referencedSection}>
          <div className={ui.sectionHead}>
            <h2 className={ui.sectionTitle}>Servicios a cargo</h2>
          </div>
          <div className={ui.grid}>
            {services.map((r) => (
              <Link key={r.id} to={`/${r.collectionSlug}/${r.slug}`} className={ui.card}>
                <h3 className={ui.cardTitle}>{r.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── dentistTestimonial: calificación en estrellas + servicio relacionado ──
function DentistTestimonialCard({ entry, href }: CardProps) {
  const rating = Number(entry.data.rating) || 0;
  return (
    <Link to={href} className={ui.card}>
      <p className={ui.quoteMark}>“</p>
      <p className={ui.cardExcerpt}>{String(entry.data.quote ?? "").slice(0, 140)}</p>
      <p className={ui.stars}>{"★".repeat(rating)}{"☆".repeat(Math.max(0, 5 - rating))}</p>
      <h3 className={ui.cardTitle}>{entry.data.entry_name ?? "Paciente"}</h3>
    </Link>
  );
}

function DentistTestimonialDetail({ data, backHref, backLabel }: DetailProps) {
  const { entry } = data;
  const rating = Number(entry.data.rating) || 0;
  const service = data.relatedTo.find((r) => r.type === "service");

  return (
    <div className={ui.detailWrap}>
      <Link to={backHref} className={ui.detailBack}>
        ← {backLabel}
      </Link>
      <div className={ui.detailHeader}>
        <p className={ui.detailBadge}>{"★".repeat(rating)}{"☆".repeat(Math.max(0, 5 - rating))}</p>
        <h1 className={ui.detailTitle}>{entry.data.entry_name ?? "Paciente"}</h1>
        {service && <p className={ui.detailSubtitle}>Sobre: {service.name}</p>}
      </div>
      <p className={ui.detailContent}>{entry.data.quote}</p>
    </div>
  );
}

// ── dentistPortfolio: caso/trabajo mostrado con antes/después (o un
// placeholder prolijo mientras no haya fotos reales cargadas) ──
const TREATMENT_LABELS: Record<string, string> = {
  ortodoncia: "Ortodoncia",
  blanqueamiento: "Blanqueamiento",
  carillas: "Carillas",
  implantes: "Implantes",
  odontopediatria: "Odontopediatría",
  rehabilitacion: "Rehabilitación oral",
};

function DentistPortfolioCard({ entry, href }: CardProps) {
  const treatment = TREATMENT_LABELS[entry.data.treatmentType] ?? entry.data.treatmentType ?? "Caso";
  return (
    <Link to={href} className={ui.card}>
      <div className={ui.artPlaceholder}>
        <span className={ui.artPlaceholderLabel}>{treatment}</span>
      </div>
      <span className={ui.cardBadge}>{treatment}</span>
      <h3 className={ui.cardTitle}>{entry.data.entry_name ?? "Caso"}</h3>
      <p className={ui.cardExcerpt}>{String(entry.data.summary ?? "").slice(0, 120)}</p>
    </Link>
  );
}

function DentistPortfolioDetail({ data, backHref, backLabel }: DetailProps) {
  const { entry } = data;
  const doctor = data.relatedTo.find((r) => r.type === "doctor");
  const treatment = TREATMENT_LABELS[entry.data.treatmentType] ?? entry.data.treatmentType ?? "Caso";

  return (
    <div className={ui.detailWrap}>
      <Link to={backHref} className={ui.detailBack}>
        ← {backLabel}
      </Link>
      <div className={ui.detailHeader}>
        <span className={ui.detailBadge}>{treatment}</span>
        <h1 className={ui.detailTitle}>{entry.data.entry_name ?? "Caso"}</h1>
        <p className={ui.detailSubtitle}>{entry.data.summary}</p>
      </div>
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="flex aspect-[4/3] items-center justify-center rounded-pub bg-pub-text-muted font-pub-display text-[1.6rem] font-bold text-white">
            Antes
          </div>
          <span className="text-center text-[1.2rem] font-bold tracking-wide text-pub-text-muted uppercase">Antes</span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex aspect-[4/3] items-center justify-center rounded-pub bg-pub-accent font-pub-display text-[1.6rem] font-bold text-white">
            Después
          </div>
          <span className="text-center text-[1.2rem] font-bold tracking-wide text-pub-text-muted uppercase">Después</span>
        </div>
      </div>
      <div className={ui.detailLayout}>
        <RichTextView value={entry.data.description} className={ui.detailContent} />
        {doctor && (
          <aside className={ui.detailSidebar}>
            <p className={ui.detailSidebarLabel}>Especialista a cargo</p>
            <Link to={`/${doctor.collectionSlug}/${doctor.slug}`} className={ui.detailSidebarLink}>
              <p className={ui.detailSidebarName}>{doctor.name}</p>
              <p className={ui.detailSidebarMeta}>Ver perfil →</p>
            </Link>
          </aside>
        )}
      </div>
    </div>
  );
}

const templates: Record<string, CollectionTemplate> = {
  default: { Card: DefaultCard, Detail: DefaultDetail },
  properties: { Card: PropertiesCard, Detail: PropertiesDetail },
  sellers: { Card: SellersCard, Detail: SellersDetail },
  blogPost: { Card: BlogPostCard, Detail: BlogPostDetail },
  dentistService: { Card: DentistServiceCard, Detail: DentistServiceDetail },
  dentistDoctor: { Card: DentistDoctorCard, Detail: DentistDoctorDetail },
  dentistTestimonial: { Card: DentistTestimonialCard, Detail: DentistTestimonialDetail },
  dentistPortfolio: { Card: DentistPortfolioCard, Detail: DentistPortfolioDetail },
};

/**
 * Devuelve el template registrado para `name`, o el "default" genérico si
 * no hay ninguno con ese nombre (o la colección no define `template`).
 * Agregar un template nuevo: escribir Card/Detail acá y sumarlos al mapa.
 */
export function getTemplate(name: string | null | undefined): CollectionTemplate {
  return (name && templates[name]) || templates.default;
}
