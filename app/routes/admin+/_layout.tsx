import { LoaderFunctionArgs } from "@remix-run/node";
import { isRouteErrorResponse, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { LayoutAdmin } from "~/admin/components";
import { listCollections } from "~/admin/use_cases";
import { requireAuth } from "~/admin/use_cases";
import { ROUTES } from "~/admin/constants";
import "~/admin/styles/global.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await requireAuth(request);
  const data = await listCollections(request);
  return { ...data, currentUser };
};

export default function AdminLayout() {
  const { collections, currentUser } = useLoaderData<typeof loader>();
  return (
    <LayoutAdmin data={collections} currentUser={currentUser}>
      <Outlet />
    </LayoutAdmin>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Error desconocido";

  return (
    <div style={{ padding: "3rem 1.5rem", fontFamily: "sans-serif", maxWidth: 640, margin: "0 auto" }}>
      <h1>Ocurrió un error en esta sección</h1>
      {process.env.NODE_ENV !== "production" && <pre style={{ whiteSpace: "pre-wrap" }}>{message}</pre>}
      <p>
        <a href={ROUTES.ADMIN}>Volver al panel</a>
      </p>
    </div>
  );
}
