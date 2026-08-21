import { ICollectionCreate } from "~/admin/interfaces";

// Ejemplo de "single": un único registro de datos (sin lista de entries).
// Útil para configuración global del sitio, homepage, etc.
const SiteSettingsCollection: ICollectionCreate = {
  name: "Configuración del sitio",
  slug: "site-settings",
  type: "global",
  fields: [
    {
      name: "siteName",
      type: "text",
      label: "Nombre del sitio",
      required: true,
    },
    {
      name: "theme",
      type: "select",
      label: "Tema visual del sitio público",
      options: [
        { label: "Moderno (verde)", value: "modern" },
        { label: "Clásico (dorado)", value: "classic" },
        { label: "Dental (celeste)", value: "dental" },
        { label: "Spa (salvia)", value: "spa" },
      ],
      defaultValue: "spa",
    },
    {
      name: "logo",
      type: "upload",
      label: "Logo",
      allowedTypes: ["image/*"],
    },
    {
      name: "footerText",
      type: "textarea",
      label: "Texto del footer",
    },
    {
      name: "contactPhone",
      type: "text",
      label: "Teléfono de contacto",
    },
    {
      name: "contactEmail",
      type: "text",
      label: "Email de contacto",
    },
    {
      name: "address",
      type: "text",
      label: "Dirección",
    },
    // Cifras mostradas en la franja de confianza del home (ver
    // app/routes/_index.tsx) — editables sin tocar código.
    {
      name: "yearsExperience",
      type: "number",
      label: "Años de experiencia",
      min: 0,
      defaultValue: 15,
    },
    {
      name: "patientsCount",
      type: "number",
      label: "Clientes atendidos",
      min: 0,
      defaultValue: 2000,
    },
    {
      name: "treatmentsCount",
      type: "number",
      label: "Tratamientos realizados",
      min: 0,
      defaultValue: 4000,
    },
  ],
  isMedia: false,
};

export default SiteSettingsCollection;
