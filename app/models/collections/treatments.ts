import { ICollectionCreate } from "~/admin/interfaces";

// Categorías de tratamientos del spa (ej. "Faciales", "Corporales",
// "Masajes"). Cada item de treatment-items apunta acá con su campo
// "treatment" — esta colección no lista sus items como campo propio, se
// resuelven al revés vía relaciones (ver app/routes/treatments.$entrySlug.tsx,
// mismo patrón que services -> doctor).
const TreatmentsCollection: ICollectionCreate = {
  name: "Tratamientos",
  slug: "treatments",
  template: "spaTreatment",
  fields: [
    {
      name: "image",
      type: "upload",
      label: "Imagen de categoría",
      allowedTypes: ["image/*"],
    },
  ],
  isMedia: false,
};

export default TreatmentsCollection;
