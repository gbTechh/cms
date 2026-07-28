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
    },{
      name: "category",
      type: "relationship",
      label: "Categoría",
      relationTo: "categories",  // slug de la colección destino
      multiple: false,            // true si quieres selección múltiple
    }
  ],
  isMedia: false,
};

export default BlogsCollection;
