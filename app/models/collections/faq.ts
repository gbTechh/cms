import { ICollectionCreate } from "~/admin/interfaces";

const FaqCollection: ICollectionCreate = {
  name: "Preguntas frecuentes",
  slug: "faq",
  fields: [
    {
      name: "answer",
      type: "richText",
      label: "Respuesta",
      required: true,
    },
  ],
  isMedia: false,
};

export default FaqCollection;
