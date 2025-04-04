import { ICollectionCreate } from "~/admin/interfaces";

const BlogsCollection: ICollectionCreate = {
  name: "Blogs",
  slug: "blogs",
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

export default BlogsCollection;
