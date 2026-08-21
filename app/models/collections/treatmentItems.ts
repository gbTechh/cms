import { ICollectionCreate } from "~/admin/interfaces";

// Cada tratamiento individual dentro de una categoría (treatments). El
// campo "treatment" es la relación hacia su categoría (mismo patrón que
// services.doctor); "benefits" es un repetidor (type: "array"): N filas,
// cada una con su propia imagen + título + descripción.
const TreatmentItemsCollection: ICollectionCreate = {
  name: "Ítems de tratamiento",
  slug: "treatment-items",
  template: "spaTreatmentItem",
  fields: [
    {
      name: "shortDescription",
      type: "textarea",
      label: "Descripción corta",
      required: true,
    },
    {
      name: "price",
      type: "number",
      label: "Precio (S/)",
      min: 0,
      required: true,
    },
    {
      name: "image",
      type: "upload",
      label: "Imagen",
      allowedTypes: ["image/*"],
    },
    {
      name: "treatment",
      type: "relationship",
      label: "Categoría",
      relationTo: "treatments",
      multiple: false,
    },
    {
      name: "benefits",
      type: "array",
      label: "Beneficios",
      fields: [
        {
          name: "image",
          type: "upload",
          label: "Imagen",
          allowedTypes: ["image/*"],
        },
        {
          name: "title",
          type: "text",
          label: "Título",
          required: true,
        },
        {
          name: "description",
          type: "text",
          label: "Descripción",
        },
      ],
    },
  ],
  isMedia: false,
};

export default TreatmentItemsCollection;
