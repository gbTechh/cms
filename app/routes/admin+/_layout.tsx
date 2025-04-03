// app/routes/_layout.admin.tsx
import { Outlet } from "@remix-run/react";

export default function AdminLayout() {
  return (
    <div className="flex flex-row gap-2">
      <aside>
        <h2>Admin Panel</h2>
        <nav className="flex flex-col gap-4 bg-gray-800">
          <a href="/admin">Dashboard</a>
          <a href="/admin/users">Usuarios</a>
          <a href="/admin/settings">Configuración</a>
        </nav>
      </aside>
      <main>
        <Outlet /> {/* Aquí se renderizan las páginas del admin */}
      </main>
    </div>
  );
}
