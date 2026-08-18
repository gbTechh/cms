# CMS — Roadmap de Producción

CMS headless construido con **Remix 2.16**, **Prisma + PostgreSQL** y arquitectura limpia (routes → pages → use_cases → infraestructure → interfaces). Inspirado en PayloadCMS.

El proyecto trae cargado como ejemplo/cliente actual el sitio de **Sonrisa Total**, una clínica dental (odontología general, ortodoncia, implantes) con reserva de citas online y portafolio de casos — ver `app/models/collections/` y la sección "Plantillas de sitio" más abajo.

---

## Stack

- **Framework:** Remix 2.16 con remix-flat-routes
- **Base de datos:** PostgreSQL via Prisma 6.x
- **Estilos:** admin → CSS Modules. Sitio público → **Tailwind v4** (`@tailwindcss/vite`), con tokens de tema (`app/content/public.css`) mapeados a variables CSS para que el theme-switching (`modern`/`classic`/`dental`) siga funcionando en vivo sin recompilar
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
- **Templates de página por colección** (`/:slug`, `/:slug/:entrySlug`) — cualquier colección `type: "collection"` es navegable en el público sin escribir una ruta a mano; el campo `template` de la colección elige el renderer (`app/content/templates/registry.tsx`), con un fallback genérico si no se define ninguno
- **Temas visuales** — paleta/tipografía del sitio público controladas por el campo `theme` del Single `site-settings`, sin tocar componentes (tokens Tailwind en `app/content/public.css`, aplicados vía `data-pub-theme` en `<html>`)
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

### Templates de frontend (implementado)

- [x] **Templates por colección** — rutas genéricas `/:slug` y `/:slug/:entrySlug` (`app/routes/$slug*.tsx`) resuelven el renderer según el campo `template` de la colección (`app/content/templates/registry.tsx`), con fallback genérico. Sin prefijo: `Collection.slug` es `@unique` en el schema, así que nunca choca con otra colección, y las rutas escritas a mano (`/admin`, `/forms`, `/`, `/reservar`) siempre le ganan por prioridad de ruta estática
- [x] **Temas visuales** — el Single `site-settings` elige el tema (`modern` / `classic` / `dental`) aplicado vía `data-pub-theme` en `<html>` (`app/root.tsx` + `app/content/theme.server.ts`); agregar un tema nuevo es sumar un bloque `:root[data-pub-theme="..."]` en `app/content/public.css`. El tema `dental` además define `--font-pub-display` (Fraunces) para los titulares
- [x] **Tailwind v4 solo en el sitio público** — `app/content/public.css` (`@import "tailwindcss"` + `@theme` con los tokens `pub-*` + `@tailwindcss/typography` para el HTML que sale de `RichTextView`). Se importa una sola vez en `app/content/PublicLayout.tsx` (no en `app/root.tsx`) para que Preflight/las utilidades queden scopeadas por Vite a las rutas públicas — el admin (`app/admin/**`) nunca importa ese layout, así que sigue 100% CSS Modules sin que nada se pise. Clases repetidas entre `registry.tsx` y las rutas genéricas (card, section, badge, avatar…) están centralizadas como strings en `app/content/ui.ts` para no reescribirlas en cada template

---

### El sitio actual: Sonrisa Total (clínica dental)

El proyecto viene configurado como el sitio de una clínica dental de ejemplo — es lo que se ve en `/` hoy. Collections (`app/models/collections/`):

| Collection | Tipo | Qué es |
|---|---|---|
| `doctors` | collection | Equipo médico |
| `services` | collection | Servicios, con precio y especialista a cargo |
| `portfolio` | collection | Casos y trabajos realizados (antes/después) — la vitrina de resultados |
| `testimonials` | collection | Testimonios de pacientes |
| `faq` | collection | Preguntas frecuentes (acordeón en el home) |
| `appointment-form` | form | Reserva de citas — `POST /forms/appointment-form`, o directo desde `app/routes/reservar.tsx` |
| `site-settings` | global | Tema, marca, contacto, y las cifras de la franja de confianza del home |
| `media` | collection especial | Galería de medios |

No hay motor de disponibilidad/calendario: la reserva es una **solicitud** (se guarda como `FormSubmission`) que el consultorio confirma por teléfono/email — no bloquea horarios en tiempo real.

Componentes de frontend específicos del vertical: `dentistDoctor`, `dentistService`, `dentistTestimonial`, `dentistPortfolio` en `app/content/templates/registry.tsx` (con placeholders prolijos — avatar con iniciales, bloque "antes/después" — mientras no se suban fotos reales).

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
6. Ajustar `app/content/PublicLayout.tsx` (nav, marca, footer) y `app/routes/_index.tsx` (home) al rubro/cliente nuevo — son clases de Tailwind directo en el JSX — y la paleta en `app/content/public.css` (o sumar un tema nuevo — ver sección de Temas visuales arriba)
7. Para secciones nuevas sin diseño curado: con darle `template` (o dejarlo sin definir → fallback genérico) y el campo `fields`, la colección ya queda navegable en `/:slug` sin escribir rutas — ver `app/content/templates/registry.tsx` para sumar un Card/Detail propio

Cuando el proyecto crezca y se aparte mucho de este starter, `npm run template:export` sirve como snapshot portable para mover datos entre entornos (staging → producción, o restaurar un backup).

---

## Desarrollo

```sh
npm install
npx prisma migrate dev
npm run dev
```
