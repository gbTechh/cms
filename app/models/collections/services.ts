import { ICollectionCreate } from "~/admin/interfaces";

const ServicesCollection: ICollectionCreate = {
  name: "Servicios",
  slug: "services",
  template: "dentistService",
  fields: [
    {
      name: "category",
      type: "select",
      label: "Categoría",
      options: [
        { label: "Preventivo", value: "preventivo" },
        { label: "Estético", value: "estetico" },
        { label: "Ortodoncia", value: "ortodoncia" },
        { label: "Odontopediatría", value: "odontopediatria" },
        { label: "Cirugía", value: "cirugia" },
        { label: "Implantes", value: "implantes" },
      ],
      defaultValue: "preventivo",
    },
    {
      name: "price",
      type: "number",
      label: "Precio desde (S/)",
      min: 0,
      required: true,
    },
    {
      name: "duration",
      type: "text",
      label: "Duración aproximada",
    },
    {
      name: "description",
      type: "richText",
      label: "Descripción",
    },
    {
      name: "doctor",
      type: "relationship",
      label: "Especialista a cargo",
      relationTo: "doctors",
      multiple: false,
    },
  ],
  isMedia: false,
};

export default ServicesCollection;
