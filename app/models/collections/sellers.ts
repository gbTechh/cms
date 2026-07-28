import { ICollectionCreate } from "~/admin/interfaces";

const SellersCollection: ICollectionCreate = {
  name: "Vendedores",
  slug: "sellers",
  fields: [
    {
      name: "position",
      type: "text",
      label: "Cargo",
      defaultValue: "Asesor inmobiliario",
    },
    {
      name: "phone",
      type: "text",
      label: "Teléfono",
    },
    {
      name: "email",
      type: "text",
      label: "Email",
    },
    {
      name: "bio",
      type: "richText",
      label: "Biografía",
    },
  ],
  isMedia: false,
};

export default SellersCollection;
