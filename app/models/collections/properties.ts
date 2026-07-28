import { ICollectionCreate } from "~/admin/interfaces";

const PropertiesCollection: ICollectionCreate = {
  name: "Propiedades",
  slug: "properties",
  fields: [
    {
      name: "price",
      type: "number",
      label: "Precio (USD)",
      min: 0,
      required: true,
    },
    {
      name: "propertyType",
      type: "select",
      label: "Tipo de propiedad",
      options: [
        { label: "Casa", value: "casa" },
        { label: "Departamento", value: "departamento" },
        { label: "Terreno", value: "terreno" },
        { label: "Oficina", value: "oficina" },
      ],
      defaultValue: "casa",
    },
    {
      name: "operation",
      type: "select",
      label: "Operación",
      options: [
        { label: "Venta", value: "venta" },
        { label: "Alquiler", value: "alquiler" },
      ],
      defaultValue: "venta",
    },
    {
      name: "address",
      type: "text",
      label: "Dirección",
      required: true,
    },
    {
      name: "bedrooms",
      type: "number",
      label: "Habitaciones",
      min: 0,
    },
    {
      name: "bathrooms",
      type: "number",
      label: "Baños",
      min: 0,
    },
    {
      name: "area",
      type: "number",
      label: "Área (m²)",
      min: 0,
    },
    {
      name: "description",
      type: "richText",
      label: "Descripción",
    },
    {
      name: "seller",
      type: "relationship",
      label: "Vendedor a cargo",
      relationTo: "sellers",
      multiple: false,
    },
  ],
  isMedia: false,
};

export default PropertiesCollection;
