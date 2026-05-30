import { createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "__cms_session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET ?? "fallback-secret-change-in-production"],
    secure: process.env.NODE_ENV === "production",
  },
});

export { getSession, commitSession, destroySession };
