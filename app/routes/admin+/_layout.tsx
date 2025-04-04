// app/routes/_layout.admin.tsx
import { Outlet } from "@remix-run/react";
import { LayoutAdmin } from "~/admin/components";

export default function AdminLayout() {
  return (
    <LayoutAdmin>
      <Outlet />
    </LayoutAdmin>
  );
}
