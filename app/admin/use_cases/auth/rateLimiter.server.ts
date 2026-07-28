// Rate limiter en memoria para intentos de login.
// Nota: al ser en memoria, el límite es por proceso — si la app corre en
// múltiples instancias (varios contenedores/workers) cada una lleva su propio
// contador. Para ese escenario habría que mover esto a Redis.

const WINDOW_MS = 15 * 60 * 1000; // ventana de conteo
const MAX_ATTEMPTS = 5; // intentos fallidos permitidos dentro de la ventana
const LOCKOUT_MS = 15 * 60 * 1000; // tiempo bloqueado tras exceder el límite

type Attempt = { count: number; firstAttempt: number; lockedUntil?: number };

const attempts = new Map<string, Attempt>();

function isLocked(key: string): number | null {
  const entry = attempts.get(key);
  if (!entry) return null;

  const now = Date.now();

  if (entry.lockedUntil && entry.lockedUntil > now) {
    return entry.lockedUntil - now;
  }

  if (entry.lockedUntil && entry.lockedUntil <= now) {
    attempts.delete(key);
    return null;
  }

  if (now - entry.firstAttempt > WINDOW_MS) {
    attempts.delete(key);
    return null;
  }

  return null;
}

function recordFailure(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttempt: now });
    return;
  }

  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
  }
}

const ipKey = (ip: string) => `ip:${ip}`;
const emailKey = (email: string) => `email:${email.trim().toLowerCase()}`;

export function checkLoginRateLimit(
  ip: string,
  email: string
): { allowed: boolean; retryAfterMs?: number } {
  const ipLock = isLocked(ipKey(ip));
  const emailLock = isLocked(emailKey(email));

  const retryAfterMs = Math.max(ipLock ?? 0, emailLock ?? 0);
  if (retryAfterMs > 0) return { allowed: false, retryAfterMs };

  return { allowed: true };
}

export function recordFailedLogin(ip: string, email: string) {
  recordFailure(ipKey(ip));
  recordFailure(emailKey(email));
}

export function clearLoginAttempts(ip: string, email: string) {
  attempts.delete(ipKey(ip));
  attempts.delete(emailKey(email));
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
