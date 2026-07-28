import { randomUUID } from "node:crypto";
import type { Session } from "@remix-run/node";
import { getSession } from "./session.server";

const CSRF_SESSION_KEY = "csrfToken";

// Devuelve el token guardado en la sesión, generando uno nuevo si no existe.
// El caller es responsable de hacer commitSession si el token es nuevo.
export function ensureCsrfToken(session: Session): string {
  let token = session.get(CSRF_SESSION_KEY) as string | undefined;
  if (!token) {
    token = randomUUID();
    session.set(CSRF_SESSION_KEY, token);
  }
  return token;
}

// Valida el campo oculto "csrf" de un formulario contra el token de la sesión
// (patrón synchronizer token, reutilizando la cookie de sesión ya firmada).
export async function assertCsrf(request: Request, formData: FormData) {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionToken = session.get(CSRF_SESSION_KEY) as string | undefined;
  const formToken = formData.get("csrf");

  if (!sessionToken || typeof formToken !== "string" || formToken !== sessionToken) {
    throw new Response("Token CSRF inválido o ausente", { status: 403 });
  }
}
