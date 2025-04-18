import { ICollectionCreate } from "~/admin/interfaces";

const ProjectsCollection: ICollectionCreate = {
  name: "Proyectos",
  slug: "proeyctos2",
  fields: [
    {
      label: "título del proyecto",
      name: "title",
      defaultValue: "Untitled",
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
