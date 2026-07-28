import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import { data, type LinksFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { commitSession, ensureCsrfToken, getSession } from "~/admin/use_cases";

import "./admin/styles/global.module.css";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Sarabun:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap",
  },
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const csrfToken = ensureCsrfToken(session);

  return data(
    { csrfToken },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div style={{ padding: "3rem 1.5rem", fontFamily: "sans-serif", maxWidth: 640, margin: "0 auto" }}>
        <h1>{error.status} {error.statusText}</h1>
        <p>{typeof error.data === "string" ? error.data : "Ocurrió un error al procesar la solicitud."}</p>
      </div>
    );
  }

  const message = error instanceof Error ? error.message : "Error desconocido";

  return (
    <div style={{ padding: "3rem 1.5rem", fontFamily: "sans-serif", maxWidth: 640, margin: "0 auto" }}>
      <h1>Algo salió mal</h1>
      <p>Ocurrió un error inesperado. Intenta recargar la página.</p>
      {process.env.NODE_ENV !== "production" && <pre style={{ whiteSpace: "pre-wrap" }}>{message}</pre>}
    </div>
  );
}
