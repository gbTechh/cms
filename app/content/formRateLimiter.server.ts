// Rate limiter en memoria para envíos de formularios públicos (contacto,
// newsletter, etc.). Igual que el de login, es por proceso: en un despliegue
// con varias instancias cada una lleva su propio contador.

const WINDOW_MS = 10 * 60 * 1000; // ventana de conteo
const MAX_PER_FORM = 5; // envíos permitidos por IP+formulario dentro de la ventana
const MAX_GLOBAL = 20; // tope por IP sumando todos los formularios (evita rotar de slug)
const SWEEP_MS = 30 * 60 * 1000; // frecuencia de limpieza de entradas vencidas

type Window = { count: number; firstSubmission: number };

const buckets = new Map<string, Window>();

function check(key: string, max: number): { allowed: boolean; retryAfterMs?: number } {
  const entry = buckets.get(key);
  if (!entry) return { allowed: true };

  const now = Date.now();
  if (now - entry.firstSubmission > WINDOW_MS) {
    buckets.delete(key);
    return { allowed: true };
  }

  if (entry.count < max) return { allowed: true };
  return { allowed: false, retryAfterMs: entry.firstSubmission + WINDOW_MS - now };
}

function record(key: string) {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now - entry.firstSubmission > WINDOW_MS) {
    buckets.set(key, { count: 1, firstSubmission: now });
    return;
  }

  entry.count += 1;
}

export function checkFormRateLimit(
  ip: string,
  slug: string
): { allowed: boolean; retryAfterMs?: number } {
  const global = check(`g:${ip}`, MAX_GLOBAL);
  if (!global.allowed) return global;
  return check(`f:${ip}:${slug}`, MAX_PER_FORM);
}

export function recordFormSubmission(ip: string, slug: string) {
  record(`g:${ip}`);
  record(`f:${ip}:${slug}`);
}

// Barrido periódico: sin esto, IPs que solo pasan una vez quedarían en el
// Map para siempre en un proceso long-lived.
const sweep = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of buckets) {
    if (now - entry.firstSubmission > WINDOW_MS) buckets.delete(key);
  }
}, SWEEP_MS);
// No debe mantener el proceso vivo solo por este timer (relevante en dev/HMR y en tests).
sweep.unref();
