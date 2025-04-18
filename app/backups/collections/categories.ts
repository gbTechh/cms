import { ICollectionCreate } from "~/admin/interfaces";

const categoriesCollection: ICollectionCreate = {
  name: "categories",
  slug: "categories",
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

export default categoriesCollection;
