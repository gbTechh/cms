import { Link } from "@remix-run/react";
// Import con efecto: activa Tailwind (Preflight incluido) solo en las rutas
// públicas — todo lo que pasa por este layout. El admin (app/admin/**) no
// importa este archivo, así que el reset de Tailwind nunca lo toca; sigue
// 100% CSS Modules. Ver app/content/public.css para los tokens de tema.
import "./public.css";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { to: "/services", label: "Servicios" },
  { to: "/portfolio", label: "Casos" },
  { to: "/doctors", label: "Equipo" },
  { to: "/testimonials", label: "Testimonios" },
  { to: "/faq", label: "Preguntas" },
];

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-pub-bg text-pub-text font-pub">
      <header className="sticky top-0 z-10 border-b border-pub-border bg-pub-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-8 py-5">
          <Link to="/" className="shrink-0 font-pub-display text-2xl font-bold tracking-tight text-pub-text">
            Sonrisa<span className="text-pub-accent">Total</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[1.4rem] font-medium text-pub-text-muted transition-colors hover:text-pub-accent"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/reservar"
              className="whitespace-nowrap rounded-full bg-pub-accent px-6 py-3 text-[1.3rem] font-bold text-white transition-colors hover:bg-pub-accent-hover"
            >
              Reservar cita
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-20 border-t border-pub-border bg-pub-surface">
        <div className="mx-auto grid max-w-6xl gap-12 px-8 py-16 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="mb-3 font-pub-display text-2xl font-bold text-pub-text">
              Sonrisa<span className="text-pub-accent">Total</span>
            </p>
            <p className="max-w-[32ch] text-[1.35rem] leading-relaxed text-pub-text-muted">
              Odontología general, ortodoncia y estética dental con especialistas dedicados a cuidar tu sonrisa.
            </p>
          </div>
          <div>
            <p className="mb-5 text-[1.2rem] font-bold tracking-wide text-pub-text-muted uppercase">Explorar</p>
            <div className="flex flex-col gap-3">
              <Link to="/services" className="text-[1.4rem] text-pub-text hover:text-pub-accent">Servicios</Link>
              <Link to="/portfolio" className="text-[1.4rem] text-pub-text hover:text-pub-accent">Casos y trabajos</Link>
              <Link to="/doctors" className="text-[1.4rem] text-pub-text hover:text-pub-accent">Nuestro equipo</Link>
              <Link to="/reservar" className="text-[1.4rem] text-pub-text hover:text-pub-accent">Reservar cita</Link>
            </div>
          </div>
          <div>
            <p className="mb-5 text-[1.2rem] font-bold tracking-wide text-pub-text-muted uppercase">Contacto</p>
            <p className="text-[1.4rem] leading-relaxed text-pub-text-muted">
              Av. Javier Prado Este 1234
              <br />
              San Isidro, Lima
              <br />
              +51 999 222 333
              <br />
              hola@sonrisatotal.pe
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-6xl border-t border-pub-border px-8 py-8 text-[1.25rem] text-pub-text-muted">
          © {new Date().getFullYear()} Sonrisa Total — Clínica Dental
        </div>
      </footer>
    </div>
  );
}
