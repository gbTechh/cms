import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useRouteLoaderData,
} from "@remix-run/react";
import { data, type LinksFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { commitSession, ensureCsrfToken, getSession } from "~/admin/use_cases";
import { getSiteTheme } from "~/content/theme.server";

// OJO: el reset (normalize.css) de acá abajo se movió a los dos entry points
// del admin (admin+/_layout.tsx y admin_.login.tsx) — a propósito, NO va acá.
// No está envuelto en un @layer, así que si cargara en toda la app le
// ganaría por cascada a las utilidades de Tailwind del sitio público (una
// regla fuera de @layer siempre le gana a cualquier regla dentro de un
// @layer, sin importar el orden ni la especificidad) y las utilidades
// dejarían de verse aunque las clases estén puestas en el HTML.

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Sarabun:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&display=swap",
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

  // El tema visual solo aplica al sitio público (admin+/*) — nos ahorramos
  // la consulta en tráfico de admin, que no lo usa.
  const url = new URL(request.url);
  const theme = url.pathname.startsWith("/admin") ? null : await getSiteTheme();

  return data(
    { csrfToken, theme },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
};

export function Layout({ children }: { children: React.ReactNode }) {
  // useRouteLoaderData (no useLoaderData): Layout también envuelve al
  // ErrorBoundary, y ahí el loader de esta misma ruta pudo no haber corrido.
  const rootData = useRouteLoaderData<typeof loader>("root");
  const theme = rootData?.theme ?? "modern";

  return (
    <html lang="en" data-pub-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          // Aplica el tema guardado antes del primer pintado, para evitar
          // el flash de tema oscuro (default) al cargar con tema claro guardado.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("cms-theme");if(t==="light"){document.documentElement.setAttribute("data-theme","light");}}catch(e){}})();`,
          }}
        />
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
