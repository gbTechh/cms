import { ICollectionCreate } from "~/admin/interfaces";

const TestimonialsCollection: ICollectionCreate = {
  name: "Testimonios",
  slug: "testimonials",
  template: "dentistTestimonial",
  fields: [
    {
      name: "rating",
      type: "number",
      label: "Calificación (1-5)",
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: "quote",
      type: "textarea",
      label: "Testimonio",
      required: true,
    },
    {
      name: "service",
      type: "relationship",
      label: "Servicio relacionado",
      relationTo: "services",
      multiple: false,
    },
  ],
  isMedia: false,
};

export default TestimonialsCollection;
