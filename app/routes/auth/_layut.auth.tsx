// app/routes/auth/_layout.auth.tsx
import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <main>
        <h2>Bienvenido</h2>
        <Outlet /> {/* Aquí se renderizan login y register */}
      </main>
    </div>
  );
}
