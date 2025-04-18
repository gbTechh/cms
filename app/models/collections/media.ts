import { ICollectionCreate } from "~/admin/interfaces";

const MediaCollection: ICollectionCreate = {
  name: "Media",
  slug: "media",
  isMedia: true,
  fields: [
    {
      label: "título del blog",
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

export default MediaCollection;
