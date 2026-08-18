import { ICollectionCreate } from "~/admin/interfaces";

// Formulario público de reserva de citas: POST /forms/appointment-form.
// No agenda contra un calendario real (no hay motor de disponibilidad/
// slots) — guarda la solicitud como FormSubmission para que la clínica la
// confirme por teléfono/email. Ver app/routes/reservar.tsx.
const AppointmentFormCollection: ICollectionCreate = {
  name: "Formulario de citas",
  slug: "appointment-form",
  type: "form",
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nombre",
      required: true,
    },
    {
      name: "phone",
      type: "text",
      label: "Teléfono",
      required: true,
    },
    {
      name: "email",
      type: "text",
      label: "Email",
      required: true,
    },
    {
      name: "service",
      type: "text",
      label: "Servicio de interés",
    },
    {
      name: "doctor",
      type: "text",
      label: "Especialista preferido",
    },
    {
      name: "preferredDate",
      type: "date",
      label: "Fecha preferida",
    },
    {
      name: "preferredTime",
      type: "select",
      label: "Horario preferido",
      options: [
        { label: "Mañana (9am - 12pm)", value: "manana" },
        { label: "Tarde (12pm - 5pm)", value: "tarde" },
        { label: "Noche (5pm - 8pm)", value: "noche" },
      ],
      defaultValue: "manana",
    },
    {
      name: "message",
      type: "textarea",
      label: "Mensaje",
    },
  ],
  isMedia: false,
};

export default AppointmentFormCollection;
