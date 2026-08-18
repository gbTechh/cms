import { ICollectionCreate } from "~/admin/interfaces";

const DoctorsCollection: ICollectionCreate = {
  name: "Equipo médico",
  slug: "doctors",
  template: "dentistDoctor",
  fields: [
    {
      name: "position",
      type: "text",
      label: "Cargo",
      required: true,
    },
    {
      name: "specialty",
      type: "select",
      label: "Especialidad",
      options: [
        { label: "Odontología general", value: "general" },
        { label: "Ortodoncia", value: "ortodoncia" },
        { label: "Odontopediatría", value: "odontopediatria" },
        { label: "Endodoncia", value: "endodoncia" },
        { label: "Cirugía oral", value: "cirugia" },
        { label: "Implantología", value: "implantologia" },
      ],
      defaultValue: "general",
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
      name: "photo",
      type: "upload",
      label: "Foto",
      allowedTypes: ["image/*"],
    },
    {
      name: "bio",
      type: "richText",
      label: "Biografía",
    },
  ],
  isMedia: false,
};

export default DoctorsCollection;
