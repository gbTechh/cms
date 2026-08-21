# CMS — Roadmap de Producción

CMS headless construido con **Remix 2.16**, **Prisma + PostgreSQL** y arquitectura limpia (routes → pages → use_cases → infraestructure → interfaces). Inspirado en PayloadCMS.

El proyecto trae cargado como ejemplo/cliente actual el sitio de **Sonrisa Total**, una clínica dental (odontología general, ortodoncia, implantes) con reserva de citas online y portafolio de casos — ver `app/models/collections/` y la sección "Plantillas de sitio" más abajo.

---

## Stack

- **Framework:** Remix 2.16 con remix-flat-routes
- **Base de datos:** PostgreSQL via Prisma 6.x
- **Estilos:** admin → CSS Modules. Sitio público → **Tailwind v4** (`@tailwindcss/vite`), con tokens de tema (`app/frontend/theme.css`) mapeados a variables CSS para que el theme-switching (`modern`/`classic`/`dental`) siga funcionando en vivo sin recompilar
- **Editor de texto:** Slate.js
- **Subida de archivos:** memoria + `fs.writeFile` (local) → migrar a S3/R2

---

## Estado actual — Lo que ya funciona

- Colecciones configurables con campos dinámicos (texto, rich text, imagen, etc.)
- CRUD de entradas con slug auto-generado y validación de unicidad
- Campos SEO y Meta por entrada (autor, fecha, estado, meta título, descripción, og image)
- Gestión de Media como colección especial (`isMedia: true`)
  - Galería con búsqueda, selección múltiple y bulk delete
  - Panel de detalle con edición de alt text, copia de URL y metadatos
  - Subida de múltiples archivos
- **Singles** (`type: "global" | "page"`) — un único registro de datos (`DataSingle`) en vez de una lista de entries; editor dedicado en el admin. Ver `app/models/collections/siteSettings.ts`
- **Forms** (`type: "form"`) — el público hace `POST /forms/:slug` (form normal o `fetch` JSON) y cada envío se guarda como `FormSubmission`, visible en el admin. Protegido con honeypot, time-trap, rate limit por IP+form y validación de Origin. Ver `app/models/collections/appointmentForm.ts` y `app/routes/reservar.tsx` (página dedicada que llama al form directo desde su propia `action`, sin depender de JS)
- **Frontend público separado del backend** (`app/frontend/`) — librería de componentes Tailwind estilo shadcn (`app/frontend/ui/`, con `cn()` de clsx+tailwind-merge), fachada de datos (`app/frontend/data/client.server.ts`) y cada página del sitio como una ruta explícita que compone ambas. Sin resolución automática de "colección → template": cada colección pública tiene su propia ruta escrita a mano. Ver la sección "Arquitectura del frontend" más abajo
- **Temas visuales** — paleta/tipografía del sitio público controladas por el campo `theme` del Single `site-settings`, sin tocar componentes (tokens Tailwind en `app/frontend/theme.css`, aplicados vía `data-pub-theme` en `<html>`)
- **Migraciones vía JSON** (`npm run template:export` / `template:import`) — snapshot completo de collections + entries + singles + relaciones + metadata de media, idempotente
- Navegación por sidebar dividida en Colecciones / Singles / Formularios
- Componentes atom reutilizables (Button, Input, TextArea, Text, Toggle, etc.)

---

## Roadmap — Features a implementar

### Autenticación y Seguridad

- [x] **Login / Logout** — Pantalla de autenticación, sesión con cookies firmadas (`createCookieSessionStorage`)
- [x] **Gestión de usuarios** — CRUD de usuarios: nombre, email, contraseña (hash bcrypt). Tabla `User` en Prisma
- [x] **Protección de rutas** — Loader middleware que redirige a `/admin/login` si no hay sesión activa

---

### Colecciones y Campos

- [ ] **Campo `relationship`** — Selector que apunta a entradas de otra colección. En el schema: `{ type: "relationship", collection: "autores" }`. Renderiza un dropdown con búsqueda
- [ ] **Validaciones de campo** — `required`, `min`, `max`, `pattern` definidos en el schema de la colección, validados en el servidor (use_case) y con feedback en el formulario

---

### Gestión de Contenido

- [ ] **Lista de entradas mejorada** — Columnas configurables, búsqueda por texto, orden por campo (fecha, nombre, estado), filtro por estado (draft/published/archived)
- [ ] **Paginación** — Cursor-based o offset. Parámetros `?page=1&limit=20` en el loader. Componente `Pagination` reutilizable
- [ ] **Estados de contenido** — `draft | published | archived` con badge visual en la lista. Botón "Publicar" en el formulario separado del "Guardar borrador"
- [ ] **Duplicar entrada** — Botón en el panel de acciones que clona la entrada actual con slug `{original}-copia` y estado `draft`

---

### Media

- [ ] **Thumbnails automáticos** — Al subir una imagen, generar variantes `thumbnail` (150px), `medium` (600px), `large` (1200px) con `sharp`. Guardar URLs de cada variante en la DB
- [ ] **Carpetas / organización** — Tabla `MediaFolder` en Prisma. Selector de carpeta en el uploader. Filtro de carpeta en la galería con sidebar colapsable
- [ ] **Previsualización de video/PDF** — Player `<video>` inline en el panel de detalle para archivos de video. Embed de PDF con `<iframe>` o `react-pdf` para PDFs

---

### UX y Polish

- [ ] **Toasts / notificaciones** — Reemplazar todos los `confirm()` y `alert()` por un sistema de toasts (contexto React + portal). Tipos: success, error, warning, info. Auto-dismiss en 4s
- [ ] **Dashboard / Inicio** — Página `/admin` con: total de entradas por colección, archivos recientes en media, accesos directos a "Nueva entrada" por colección
- [ ] **Breadcrumbs** — Componente `<Breadcrumb>` en el header del layout con la ruta actual. Ej: `Admin > Proyectos > Mi entrada`
- [ ] **Vista previa del contenido** — Botón "Ver en sitio" que abre `{FRONTEND_URL}/{collection.slug}/{entry.slug}` en nueva pestaña. URL configurable en settings
- [ ] **Skeleton loaders** — Estados de carga para la lista de entradas y la galería de media mientras el loader resuelve
- [ ] **Accesibilidad (a11y)** — Focus trap en modales/panels, roles ARIA correctos en cards y checkboxes, navegación completa por teclado, contraste de colores AA

---

### Singles (implementado)

> Un Single es una colección con `type: "global"` o `"page"` — sin listado de entradas, va directo al formulario de edición de **un único documento** (`DataSingle`). Igual que `isMedia: true` pero para configuración singleton.

- [x] **Singles** — `type: "global" | "page"` en el schema de colección. `SingleEdit.tsx` carga/crea el único registro al entrar. Separados visualmente en el sidebar bajo "Singles"
- [x] **Configuración del proyecto** — Single predefinido `site-settings`: nombre del sitio, tema visual, logo, footer, contacto

---

### Forms (implementado)

> Una colección `type: "form"` no tiene entries editables desde el admin: el público hace `POST /forms/:slug` y cada envío se guarda como `FormSubmission`, listado (solo lectura + eliminar) en el admin bajo "Formularios".

- [x] **Definición de formularios** — cualquier colección `type: "form"` (ver `app/models/collections/appointmentForm.ts`)
- [x] **Endpoint público** — `app/routes/forms.$slug.ts`, acepta `<form>` normal o `fetch()` JSON
- [x] **Anti-spam** — honeypot, time-trap, rate limit (por IP+form y global por IP), chequeo de `Origin`, límite de tamaño de payload, whitelist de campos guardados

---

### Arquitectura del frontend (implementado)

El sitio público vive separado del backend en `app/frontend/` — el admin (`app/admin/`, `app/content/*.server.ts`) no lo importa nunca, y viceversa:

```
app/frontend/
  ui/            Librería de componentes (estilo shadcn): Text, Heading, Price, Badge,
                 Avatar, Rating, Button/ButtonLink, Card/CardLink, LinkText, Section,
                 Grid, Accordion, Sidebar, Pagination, RichText, Nav, Footer...
                 Todos aceptan `className` mergeado con cn() (clsx + tailwind-merge) —
                 la base de estilos se pisa sin pelear con Tailwind. cn.ts es el
                 utilitario, ui/index.ts el barrel de exports.
  data/
    client.server.ts   Única puerta a los datos: getCollections(), getEntries(slug, opts),
                       getEntry(slug, entrySlug), getSingle(slug), searchEntries(slug, q, opts),
                       getTheme(). Por debajo llaman a app/content/queries.server.ts (Prisma
                       real) — un template nunca importa ese archivo directo.
  templates/
    Layout.tsx    Chrome del sitio (Nav + Footer + contenido de ESTE proyecto)
  lib/            format.ts, labels.ts, richtext.ts — helpers chicos compartidos
  theme.css       @import "tailwindcss" + @theme con los tokens pub-* + @tailwindcss/typography
```

**No hay resolución automática "colección → template"** (no existe un `registry.tsx` ni un `getTemplate()`): cada colección que se quiere pública tiene su propia ruta escrita a mano en `app/routes/` (`services._index.tsx`, `services.$entrySlug.tsx`, etc.), que arma su loader con `~/frontend/data/client.server` y su JSX con `~/frontend/ui`. Ver el bloque de abajo para la lista de páginas actuales. Trade-off consciente: una colección nueva **no aparece sola** en el público hasta que se le escribe la ruta — a cambio, cada página tiene control total sin pelear con un contrato compartido.

- [x] **Temas visuales** — el Single `site-settings` elige el tema (`modern` / `classic` / `dental`) aplicado vía `data-pub-theme` en `<html>` (`app/root.tsx` + `app/content/theme.server.ts`); agregar un tema nuevo es sumar un bloque `:root[data-pub-theme="..."]` en `app/frontend/theme.css`. El tema `dental` además define `--font-pub-display` (Fraunces) para los titulares
- [x] **Tailwind v4 solo en el sitio público** — `app/frontend/theme.css` se importa una sola vez en `app/frontend/templates/Layout.tsx` (no en `app/root.tsx`) para que Preflight/las utilidades queden scopeadas por Vite a las rutas que pasan por ese Layout — el admin nunca lo importa, así que sigue 100% CSS Modules sin que nada se pise (verificado: el admin no tiene ni un `--tw-*` en su HTML, y el público no tiene ni un `normalize.css`)

---

### El sitio actual: Sonrisa Total (clínica dental)

El proyecto viene configurado como el sitio de una clínica dental de ejemplo. Collections (`app/models/collections/`) y su ruta pública:

| Collection | Tipo | Qué es | Rutas |
|---|---|---|---|
| `doctors` | collection | Equipo médico | `/doctors`, `/doctors/:slug` |
| `services` | collection | Servicios, con precio y especialista a cargo | `/services`, `/services/:slug` |
| `portfolio` | collection | Casos y trabajos realizados (antes/después) | `/portfolio`, `/portfolio/:slug` |
| `testimonials` | collection | Testimonios de pacientes | `/testimonials`, `/testimonials/:slug` |
| `faq` | collection | Preguntas frecuentes (acordeón) | `/faq`, `/faq/:slug` |
| `appointment-form` | form | Reserva de citas | `POST /forms/appointment-form`, página dedicada en `/reservar` |
| `site-settings` | global | Tema, marca, contacto, cifras de la franja de confianza del home | — (se lee, no tiene página propia) |
| `media` | collection especial | Galería de medios | — (solo admin) |

No hay motor de disponibilidad/calendario: la reserva es una **solicitud** (se guarda como `FormSubmission`) que el consultorio confirma por teléfono/email — no bloquea horarios en tiempo real.

---

### Migraciones y starter kit (implementado)

- [x] **Export/import JSON** — `npm run template:export -- [nombre]` / `npm run template:import -- <archivo>`. Snapshot de collections + entries + DataSingle + relaciones + metadata de media (no los binarios de `/public/uploads`, hay que copiarlos aparte). Idempotente: correrlo dos veces no duplica nada
- [x] **Preset del sitio actual** — `templates/dentist-clinic.json` trae el contenido de ejemplo completo de Sonrisa Total (doctores, servicios, casos, testimonios, FAQ, config del sitio). Sirve para restaurar el contenido demo en una base nueva: `npm run sync && npm run template:import -- templates/dentist-clinic.json`
- [x] **Demo anterior (real-estate)** — este proyecto arrancó como demo inmobiliaria; ese contenido quedó archivado en `templates/demo-real-estate.json` por si se quiere retomar ese rubro (no está activo: sus collections están soft-deleted y sus rutas curadas fueron removidas). Para revivirlo: recrear los archivos de `app/models/collections/` de esa época (ver historial de git), `npm run sync`, y luego el import de ese JSON

---

### DevOps y Producción

- [ ] **Manejo de errores global** — `ErrorBoundary` en el layout raíz del admin con página de error amigable. Manejo de errores de Prisma (unique constraint, not found) con mensajes de usuario
- [ ] **Upload a storage externo** — Adaptador intercambiable: local (actual) vs S3/Cloudflare R2. Variable `STORAGE_ADAPTER=local|s3` en `.env`. Usar `@aws-sdk/client-s3` para el adaptador S3
- [ ] **Logs de actividad** — Tabla `ActivityLog` en Prisma: `userId`, `action` (create/update/delete), `collection`, `entryId`, `timestamp`. Vista en el dashboard con los últimos 50 eventos
- [ ] **Tests** — Tests de integración con Vitest para los use_cases críticos: autenticación, crear/editar/eliminar entrada, subir media, validación de slug único

---

## Variables de entorno

```env
DATABASE_URL=postgresql://user:password@localhost:5432/cms
SESSION_SECRET=cambiar-en-produccion
FRONTEND_URL=http://localhost:3001
STORAGE_ADAPTER=local          # local | s3
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
```

---

## Arquitectura

```
app/
  admin/
    components/
      atoms/          # Button, Input, TextArea, Text, Toggle, ...
      molecules/      # FormField, SearchBar, ...
      organisms/      # Tabs, FileSelector, FieldFactory, ...
      pages/          # MediaPage, MediaNew, EntryNew, ...
    infraestructure/
      repositories/   # Prisma implementations
    interfaces/
      entities/       # ICollection, IEntry, IMedia, IUser, ...
      repositories/   # Abstract repository interfaces
    use_cases/
      collections/    # createEntry, updateEntry, deleteEntry, ...
      media/          # uploadMedia, listMedia, deleteMedia, ...
      auth/           # login, logout, getSession, ...
  routes/
    admin+/           # Layout y rutas del admin
```

---

## Usar este proyecto como starter kit para un cliente nuevo

1. Clonar el repo, cambiar `DATABASE_URL`/`SESSION_SECRET` en `.env` y correr `npx prisma migrate dev`
2. Si el rubro del cliente nuevo NO es una clínica dental: borrar los archivos de `app/models/collections/` que no apliquen (`doctors.ts`, `services.ts`, `portfolio.ts`, `testimonials.ts`, `faq.ts`, `appointmentForm.ts`) y escribir los del rubro nuevo (mismo formato `ICollectionCreate`, ver esos archivos como referencia) — `media.ts` y `siteSettings.ts` son infraestructura, no hace falta tocarlos
3. `npm run sync` para que las colecciones del punto anterior queden en la base (esto da de baja por soft-delete las que ya no tengan archivo)
4. Opcional: `npm run template:import -- templates/dentist-clinic.json` (si es otra clínica dental) o el JSON del rubro que corresponda, para arrancar con contenido de ejemplo navegable de inmediato
5. Crear el primer usuario admin (`app/admin/scripts/` no trae un seed de usuario todavía — hacerlo a mano vía Prisma Studio o un script rápido con `bcryptjs`)
6. Ajustar `app/frontend/templates/Layout.tsx` (nav, marca, footer) y `app/routes/_index.tsx` (home) al rubro/cliente nuevo — son clases de Tailwind directo en el JSX, componiendo `app/frontend/ui/` — y la paleta en `app/frontend/theme.css` (o sumar un tema nuevo — ver sección de Temas visuales arriba)
7. Para secciones nuevas: escribir su ruta a mano en `app/routes/` (ej. `productos._index.tsx` + `productos.$entrySlug.tsx`) con un loader que llame a `~/frontend/data/client.server` y un componente armado con `~/frontend/ui` — usar `services._index.tsx`/`services.$entrySlug.tsx` como referencia

Cuando el proyecto crezca y se aparte mucho de este starter, `npm run template:export` sirve como snapshot portable para mover datos entre entornos (staging → producción, o restaurar un backup).

---

## Desarrollo

```sh
npm install
npx prisma migrate dev
npm run dev
```
