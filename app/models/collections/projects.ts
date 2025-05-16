import { ICollectionCreate } from "~/admin/interfaces";

const ProjectsCollection: ICollectionCreate = {
  name: "Proyectos",
  slug: "proeyctos2",
  fields: [
    {
      label: "título del proyecto",
      name: "title",
      type: "text",
      required: true,
      defaultValue: "valor por defecto",
    },
    {
      name: "texto largo",
      type: "textarea",
      label: "contenido",
      required: false,
    },
    {
      label: "numerito ito",
      name: "field para numero",
      type: "number",
      required: true,
      step: 0.1,
      max: 100,
      min: 0,
      defaultValue: 0.0,
    },
    {
      name: "booleano",
      type: "toggle",
      label: "sera verdad",
      required: true,
      defaultValue: false,
    },
    {
      name: "fecha",
      type: "date",
      label: "Escoge tu fecha",
      required: true,
      defaultValue: "",
    },
    {
      name: "select",
      type: "select",
      options: [
        { label: "Web", value: "web" },
        { label: "Ecommerce", value: "ecommerce" },
        { label: "Landing", value: "landing" },
        { label: "SEO", value: "seo" },
        { label: "SEO1", value: "seo1" },
        { label: "SEO2", value: "seo2" },
        { label: "SEO3", value: "seo3" },
        { label: "SEO4", value: "seo4" },
        { label: "SEO5", value: "seo5" },
      ],
      label: "Tipo de web",
      required: true,
      defaultValue: "seo2",
    },
    {
      name: "isActive",
      label: "¿Está activa la encuesta?",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "favoriteGenre",
      label: "Género favorito",
      type: "radio",
      options: [
        { label: "Rock", value: "rock" },
        { label: "Pop", value: "pop" },
        { label: "Clásica", value: "classical" },
        { label: "Jazz", value: "jazz" },
      ],
      required: true,
      defaultValue: "jazz", // Valor por defecto
    },
    {
      name: "type",
      type: "select",
      hasMany: true,
      label: "Tipo",
      options: [
        { label: "Sitio Web", value: "website" },
        { label: "GitHub", value: "github" },
        { label: "Documentación", value: "docs" },
        { label: "Demo", value: "demo" },
        { label: "Otro", value: "other" },
      ],
      defaultValue: ["website"],
    },
    {
      name: "responses",
      label: "Respuestas",
      type: "array", // Esto sería reemplazado por CustomArrayField
      fields: [
        { name: "answer", type: "text", label: "Respuesta", required: true },
        { name: "pregunta", type: "text", label: "Pregunta", required: true },
        {
          name: "selection",
          type: "select",
          label: "Tipo",
          options: [
            { label: "Sitio Web", value: "website" },
            { label: "GitHub", value: "github" },
            { label: "Documentación", value: "docs" },
            { label: "Demo", value: "demo" },
            { label: "Otro", value: "other" },
          ],
          required: true,
        },
        {
          name: "aaaa",
          type: "array",
          label: "arraysito",
          fields: [{ name: "hola", type: "text", label: "saludo" }],
        },
      ],
      minItems: 1,
      maxItems: 3,
      required: true,
    },
  ],
};

export default ProjectsCollection;
