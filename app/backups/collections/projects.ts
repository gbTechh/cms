import { ICollectionCreate } from "~/admin/interfaces";

const ProyectosCollection: ICollectionCreate = {
  name: "Proyectos",
  slug: "proeyctos2",
  fields: [
  {
    "name": "title",
    "type": "text",
    "label": "título del proyecto",
    "defaultValue": "Untitled"
  },
  {
    "name": "content",
    "type": "richText",
    "label": "contenido"
  }
],
  isMedia: false,
};

export default ProyectosCollection;
