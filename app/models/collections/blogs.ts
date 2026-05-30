import { ICollectionCreate } from "~/admin/interfaces";

const BlogsCollection: ICollectionCreate = {
  name: "Blogs",
  slug: "blogs",
  fields: [
    {
      name: "title",
      type: "text",
      label: "título del blog",
      defaultValue: "Untitled",
    },
    {
      name: "content",
      type: "richText",
      label: "contenido",
    },
  ],
  isMedia: false,
};

export default BlogsCollection;
