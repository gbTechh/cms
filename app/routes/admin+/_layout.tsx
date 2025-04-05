// app/routes/_layout.admin.tsx
import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { ICollection } from "~/admin";
import { LayoutAdmin } from "~/admin/components";
import { listCollections } from "~/admin/use_cases";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  
  const data = await listCollections(request);

  return data
  
};


export default function AdminLayout() {
  const { collections } = useLoaderData<typeof loader>();
  return (
    <LayoutAdmin data={collections}>
      <Outlet />
    </LayoutAdmin>
  );
}
