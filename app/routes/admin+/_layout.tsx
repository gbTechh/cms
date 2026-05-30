import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { LayoutAdmin } from "~/admin/components";
import { listCollections } from "~/admin/use_cases";
import { requireAuth } from "~/admin/use_cases";

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
