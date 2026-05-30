# CMS — Roadmap de Producción

CMS headless construido con **Remix 2.16**, **Prisma + PostgreSQL** y arquitectura limpia (routes → pages → use_cases → infraestructure → interfaces). Inspirado en PayloadCMS.

---

## Stack

- **Framework:** Remix 2.16 con remix-flat-routes
- **Base de datos:** PostgreSQL via Prisma 6.x
- **Estilos:** CSS Modules
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
- Navegación por sidebar con colecciones y media
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

### Globals (Singles)

> Un Global es una colección con `isSingle: true` — sin listado de entradas, va directo al formulario de edición de **un único documento**. Igual que `isMedia: true` pero para configuración singleton.

- [ ] **Globals** — Soporte para `isSingle: true` en el schema de colección. Ruta `/admin/globals/[slug]` que carga o crea el único registro al entrar. Separados visualmente en el sidebar bajo "Globals"
- [ ] **Configuración del proyecto** — Global predefinido `site-settings`: nombre del sitio, URL del frontend, timezone, idioma por defecto, favicon

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

## Desarrollo

```sh
npm install
npx prisma migrate dev
npm run dev
```
