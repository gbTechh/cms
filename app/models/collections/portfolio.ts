import { ICollectionCreate } from "~/admin/interfaces";

// Portafolio de trabajos/casos realizados — la razón de ser de este
// vertical: un odontólogo vende confianza mostrando resultados reales.
// beforePhoto/afterPhoto son opcionales: sin fotos cargadas, el template
// (dentistPortfolio en registry.tsx) muestra un placeholder prolijo en vez
// de un ícono de imagen rota.
const PortfolioCollection: ICollectionCreate = {
  name: "Casos y trabajos",
  slug: "portfolio",
  template: "dentistPortfolio",
  fields: [
    {
      name: "treatmentType",
      type: "select",
      label: "Tipo de tratamiento",
      options: [
        { label: "Ortodoncia", value: "ortodoncia" },
        { label: "Blanqueamiento", value: "blanqueamiento" },
        { label: "Carillas", value: "carillas" },
        { label: "Implantes", value: "implantes" },
        { label: "Odontopediatría", value: "odontopediatria" },
        { label: "Rehabilitación oral", value: "rehabilitacion" },
      ],
      defaultValue: "ortodoncia",
    },
    {
      name: "summary",
      type: "textarea",
      label: "Resumen breve (se muestra en la card)",
      required: true,
    },
    {
      name: "description",
      type: "richText",
      label: "Detalle del caso",
    },
    {
      name: "beforePhoto",
      type: "upload",
      label: "Foto antes",
      allowedTypes: ["image/*"],
    },
    {
      name: "afterPhoto",
      type: "upload",
      label: "Foto después",
      allowedTypes: ["image/*"],
    },
    {
      name: "doctor",
      type: "relationship",
      label: "Especialista a cargo",
      relationTo: "doctors",
      multiple: false,
    },
    {
      name: "featured",
      type: "toggle",
      label: "Destacar en el home",
      defaultValue: false,
    },
  ],
  isMedia: false,
};

export default PortfolioCollection;
