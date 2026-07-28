import { createCookieSessionStorage } from "@remix-run/node";

if (!process.env.SESSION_SECRET) {
  throw new Error(
    "SESSION_SECRET no está definido. Configúralo en .env/.env.local (usa un valor aleatorio largo, ej. `openssl rand -hex 32`)."
  );
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "__cms_session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export { getSession, commitSession, destroySession };
