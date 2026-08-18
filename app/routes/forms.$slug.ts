import type { ActionFunctionArgs } from "@remix-run/node";
import { submitPublicForm } from "~/content/forms.server";
import { getClientIp } from "~/admin/use_cases/auth/rateLimiter.server";
import { checkFormRateLimit, recordFormSubmission } from "~/content/formRateLimiter.server";

const MAX_BODY_BYTES = 100 * 1024; // 100kb: generoso para un formulario de texto, corta payloads gigantes

const jsonError = (message: string, status: number, headers?: HeadersInit) =>
  Response.json({ success: false, errors: [{ field: "_form", message }] }, { status, headers });

const methodNotAllowed = () => jsonError("Método no permitido", 405);

// Solo POST: GET/HEAD llegan aquí en vez de fallar con el error genérico
// de Remix por falta de loader.
export const loader = async () => methodNotAllowed();

// Endpoint público: POST /forms/:slug — recibe datos de cualquier formulario
// (contacto, newsletter, etc.) definido como colección type "form" y los
// guarda como FormSubmission. Acepta tanto <form method="post"> normal
// (application/x-www-form-urlencoded) como fetch() con JSON.
//
// Protección anti-spam (defensa en profundidad, ninguna capa es infalible
// por sí sola):
//  1. Origin: si el navegador manda Origin y no coincide con este host,
//     se rechaza (bloquea fetch() disparado desde otro sitio).
//  2. Content-Length: corta bodies anormalmente grandes antes de parsear.
//  3. Rate limit por IP+formulario y global por IP (formRateLimiter).
//  4. Honeypot + time-trap (`_ts`/`_gotcha`) y validación de campos, en
//     submitPublicForm.
export const action = async ({ request, params }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return methodNotAllowed();
  }

  // OJO: en `npm run dev` (Vite), el adapter de Remix arma `request.url`
  // usando el propio header Origin cuando viene presente (node-adapter.js),
  // así que esta comparación es un no-op en desarrollo. En producción
  // (remix-serve / @remix-run/express) sí usa Host/X-Forwarded-Host, y este
  // chequeo bloquea de verdad los POST cross-origin.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return jsonError("Origen no permitido", 403);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonError("Envío demasiado grande", 413);
  }

  const slug = params.slug!;
  const ip = getClientIp(request);
  const rate = checkFormRateLimit(ip, slug);
  if (!rate.allowed) {
    const retryAfterSec = Math.ceil((rate.retryAfterMs ?? 0) / 1000);
    return jsonError("Demasiados envíos, intenta más tarde", 429, {
      "Retry-After": String(retryAfterSec),
    });
  }

  const contentType = request.headers.get("content-type") ?? "";
  let payload: Record<string, any> = {};
  if (contentType.includes("application/json")) {
    payload = await request.json();
  } else {
    const formData = await request.formData();
    payload = Object.fromEntries(formData.entries());
  }

  const result = await submitPublicForm(slug, payload);
  if (result.success) recordFormSubmission(ip, slug);

  return Response.json(result, { status: result.success ? 200 : 400 });
};
