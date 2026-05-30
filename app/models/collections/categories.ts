import { ICollectionCreate } from "~/admin/interfaces";

const ProjectsCollection: ICollectionCreate = {
  name: "categories",
  slug: "categories",
  fields: [
    {
      label: "título del proyecto",
      name: "title",
      defaultValue: "",
      type: "text",
    },
    {
      name: "content",
      type: "richText",
      label: "contenido",
    },
  ],
};

export default ProjectsCollection;
