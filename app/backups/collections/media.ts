import { ICollectionCreate } from "~/admin/interfaces";

const MediaCollection: ICollectionCreate = {
  name: "Media",
  slug: "media",
  fields: [
  {
    "name": "title",
    "type": "text",
    "label": "título del blog",
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

export default MediaCollection;
