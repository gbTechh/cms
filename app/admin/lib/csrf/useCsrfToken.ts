import { useRouteLoaderData } from "@remix-run/react";

export function useCsrfToken(): string {
  const rootData = useRouteLoaderData("root") as { csrfToken?: string } | undefined;
  return rootData?.csrfToken ?? "";
}
