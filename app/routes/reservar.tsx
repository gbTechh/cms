import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { getPublicCollection } from "~/content/queries.server";
import { submitPublicForm } from "~/content/forms.server";
import { checkFormRateLimit, recordFormSubmission } from "~/content/formRateLimiter.server";
import { getClientIp } from "~/admin/use_cases/auth/rateLimiter.server";
import { PublicLayout } from "~/content/PublicLayout";
import * as ui from "~/content/ui";

// Página dedicada de reserva de citas. A diferencia de forms.$slug.ts (el
// endpoint genérico que consume cualquier <form> externo), esta ruta llama
// a submitPublicForm() directo desde su propia `action` — así funciona sin
// JS (progressive enhancement real: sin JS, el navegador postea acá mismo y
// Remix re-renderiza con el resultado, en vez de aterrizar en un JSON
// pelado) y sigue reusando las mismas protecciones anti-spam.
export const meta: MetaFunction = () => [
  { title: "Reservar cita — Sonrisa Total" },
  { name: "description", content: "Reservá tu cita en Sonrisa Total: elegí el servicio, el especialista y el horario que prefieras." },
];

const FORM_SLUG = "appointment-form";

const fieldCls = "flex flex-col gap-2";
const labelCls = "text-[1.25rem] font-semibold text-pub-text";
const inputCls =
  "rounded-md border border-pub-border bg-pub-bg px-5 py-4 font-pub text-[1.4rem] text-pub-text " +
  "transition-colors focus:border-pub-accent focus:outline-none";
const fieldErrorCls = "text-[1.2rem] text-red-600";

export const loader = async (_: LoaderFunctionArgs) => {
  const [services, doctors] = await Promise.all([
    getPublicCollection("services", { page: 1, pageSize: 50 }),
    getPublicCollection("doctors", { page: 1, pageSize: 50 }),
  ]);
  return { services, doctors, formTs: Date.now() };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData.entries());

  const ip = getClientIp(request);
  const rate = checkFormRateLimit(ip, FORM_SLUG);
  if (!rate.allowed) {
    return { success: false, errors: [{ field: "_form", message: "Demasiados envíos, intenta más tarde." }] };
  }

  const result = await submitPublicForm(FORM_SLUG, payload);
  if (result.success) recordFormSubmission(ip, FORM_SLUG);
  return result;
};

export default function Reservar() {
  const { services, doctors, formTs } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const fieldError = (field: string) => actionData?.errors?.find((e) => e.field === field)?.message;

  return (
    <PublicLayout>
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-12 px-8 pt-20 pb-24 md:grid-cols-[0.9fr_1.1fr]">
        <div className="md:sticky md:top-32">
          <span className={ui.cardBadge}>Reserva tu cita</span>
          <h1 className="mb-5 font-pub-display text-[3.2rem] leading-tight font-semibold tracking-tight">Agendemos tu visita</h1>
          <p className="mb-8 text-[1.5rem] leading-relaxed text-pub-text-muted">
            Completá el formulario y nuestro equipo te confirma por teléfono o email en menos de 24 horas.
            Si preferís, también podés llamarnos directamente.
          </p>
          <div className="flex flex-col gap-3">
            <p className="text-[1.4rem] font-semibold text-pub-text">✓ Confirmación en menos de 24h</p>
            <p className="text-[1.4rem] font-semibold text-pub-text">✓ Sin costo por la primera consulta</p>
            <p className="text-[1.4rem] font-semibold text-pub-text">✓ Atendemos seguros dentales</p>
          </div>
        </div>

        <div className="rounded-[calc(var(--radius-pub)+0.2rem)] border border-pub-border bg-pub-surface p-10 shadow-pub">
          {actionData?.success ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-pub-accent text-[2.6rem] text-white">✓</div>
              <h2 className="mb-3 font-pub-display text-[2.2rem] font-semibold">¡Solicitud recibida!</h2>
              <p className="text-[1.4rem] leading-relaxed text-pub-text-muted">
                Gracias por escribirnos. Te contactaremos pronto para confirmar el día y la hora de tu cita.
              </p>
            </div>
          ) : (
            <Form method="post" className="flex flex-col gap-6">
              <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] h-px w-px opacity-0" aria-hidden="true" />
              <input type="hidden" name="_ts" value={formTs} />

              {fieldError("_form") && (
                <p className="rounded-md bg-red-600/10 px-5 py-4 text-[1.3rem] text-red-600">{fieldError("_form")}</p>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <label className={fieldCls}>
                  <span className={labelCls}>Nombre completo</span>
                  <input name="name" required className={inputCls} placeholder="Tu nombre" />
                  {fieldError("name") && <span className={fieldErrorCls}>{fieldError("name")}</span>}
                </label>
                <label className={fieldCls}>
                  <span className={labelCls}>Teléfono</span>
                  <input name="phone" required className={inputCls} placeholder="+51 999 000 000" />
                  {fieldError("phone") && <span className={fieldErrorCls}>{fieldError("phone")}</span>}
                </label>
              </div>

              <label className={fieldCls}>
                <span className={labelCls}>Email</span>
                <input name="email" type="email" required className={inputCls} placeholder="tu@email.com" />
                {fieldError("email") && <span className={fieldErrorCls}>{fieldError("email")}</span>}
              </label>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <label className={fieldCls}>
                  <span className={labelCls}>Servicio de interés</span>
                  <select name="service" className={inputCls} defaultValue="">
                    <option value="">Elegir servicio…</option>
                    {services?.entries.map((s) => (
                      <option key={s.id} value={s.data.entry_name}>{s.data.entry_name}</option>
                    ))}
                  </select>
                </label>
                <label className={fieldCls}>
                  <span className={labelCls}>Especialista preferido</span>
                  <select name="doctor" className={inputCls} defaultValue="">
                    <option value="">Sin preferencia</option>
                    {doctors?.entries.map((d) => (
                      <option key={d.id} value={d.data.entry_name}>{d.data.entry_name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <label className={fieldCls}>
                  <span className={labelCls}>Fecha preferida</span>
                  <input name="preferredDate" type="date" className={inputCls} />
                </label>
                <label className={fieldCls}>
                  <span className={labelCls}>Horario preferido</span>
                  <select name="preferredTime" className={inputCls} defaultValue="manana">
                    <option value="manana">Mañana (9am - 12pm)</option>
                    <option value="tarde">Tarde (12pm - 5pm)</option>
                    <option value="noche">Noche (5pm - 8pm)</option>
                  </select>
                </label>
              </div>

              <label className={fieldCls}>
                <span className={labelCls}>Mensaje (opcional)</span>
                <textarea name="message" rows={3} className={inputCls} placeholder="Contanos si tenés alguna consulta particular" />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 rounded-full bg-pub-accent px-8 py-5 text-[1.5rem] font-bold text-white transition-colors hover:bg-pub-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Enviando…" : "Solicitar cita"}
              </button>
            </Form>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
