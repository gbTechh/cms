// Clases Tailwind reutilizadas entre app/content/templates/registry.tsx y
// las rutas genéricas ($slug._index.tsx, $slug.$entrySlug.tsx, _index.tsx).
// Son solo strings de utilidades — nada de @apply ni CSS propio — para no
// repetir el mismo bloque larguísimo en cada Card/Detail. Los colores
// (pub-*) y tipografías (font-pub*) salen de app/content/public.css, que
// cambian solos según el tema activo (data-pub-theme en <html>).

export const section = "mx-auto max-w-6xl px-8 py-14";
export const sectionAlt = `${section} border-y border-pub-border bg-pub-surface`;
export const sectionHead = "mb-8 flex items-baseline justify-between gap-4";
export const sectionTitle = "font-pub-display text-[2.4rem] font-bold tracking-tight";
export const sectionLink = "text-[1.4rem] font-semibold text-pub-accent hover:underline";
export const grid = "grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6";
export const empty = "py-8 text-[1.4rem] text-pub-text-muted";

export const card =
  "flex flex-col rounded-pub border border-pub-border bg-pub-surface p-7 text-pub-text no-underline " +
  "transition duration-150 hover:-translate-y-0.5 hover:shadow-pub";
export const cardTitle = "mb-2 font-pub-display text-[1.8rem] font-bold";
export const cardMeta = "mb-1 text-[1.3rem] text-pub-text-muted";
export const cardBadge =
  "mb-4 inline-block self-start rounded-full bg-pub-accent/10 px-3 py-1 text-[1.1rem] font-semibold " +
  "tracking-wide text-pub-accent uppercase";
export const cardPrice = "mt-4 text-[1.9rem] font-bold text-pub-accent";
export const cardExcerpt = "mt-3 text-[1.35rem] leading-relaxed text-pub-text-muted";

export const pagination = "mt-10 flex justify-center gap-4";
export const pageLink = "rounded-pub border border-pub-border px-6 py-3 text-[1.3rem] font-semibold text-pub-text hover:border-pub-accent hover:text-pub-accent";
export const pageLinkDisabled = "pointer-events-none opacity-40";

export const detailWrap = "mx-auto max-w-6xl px-8 pt-12 pb-20";
export const detailBack = "mb-6 inline-block text-[1.3rem] font-semibold text-pub-text-muted hover:text-pub-accent";
export const detailHeader = "mb-8";
export const detailTitle = "mb-2 font-pub-display text-[3rem] font-bold tracking-tight";
export const detailSubtitle = "text-[1.5rem] text-pub-text-muted";
export const detailBadge =
  "mb-4 inline-block rounded-full bg-pub-accent/10 px-3 py-1 text-[1.1rem] font-semibold tracking-wide text-pub-accent uppercase";
export const detailPrice = "mt-4 text-[2.4rem] font-bold text-pub-accent";
export const detailLayout = "mt-10 grid items-start gap-12 md:grid-cols-[2fr_1fr]";
export const detailSpecs = "mb-8 flex gap-8 border-y border-pub-border py-6";
export const detailSpec = "flex flex-col";
export const detailSpecValue = "text-[1.8rem] font-bold";
export const detailSpecLabel = "text-[1.2rem] text-pub-text-muted";
export const detailContent = "prose max-w-none text-[1.45rem] leading-relaxed";
export const detailSidebar = "rounded-pub border border-pub-border bg-pub-surface p-7";
export const detailSidebarLabel = "mb-4 text-[1.1rem] tracking-wide text-pub-text-muted uppercase";
export const detailSidebarLink = "block text-inherit no-underline";
export const detailSidebarName = "mb-1 text-[1.7rem] font-bold";
export const detailSidebarMeta = "text-[1.3rem] text-pub-text-muted";
export const referencedSection = "mt-12";

export const avatar =
  "mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pub-accent to-pub-text " +
  "font-pub-display text-[1.9rem] font-bold text-white";
export const avatarLg =
  "mb-5 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-pub-accent to-pub-text " +
  "font-pub-display text-[2.6rem] font-bold text-white";

export const artPlaceholder =
  "-mx-7 -mt-7 mb-5 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-t-[calc(var(--radius-pub)-0.2rem)] " +
  "bg-gradient-to-br from-pub-accent to-pub-text";
export const artPlaceholderLabel = "px-6 text-center font-pub-display text-[1.9rem] font-bold text-white/90";

export const quoteMark = "mb-2 font-pub-display text-[3.6rem] leading-none text-pub-accent/35";
export const stars = "text-[1.3rem] tracking-widest text-pub-accent";
