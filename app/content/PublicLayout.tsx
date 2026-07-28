import { Link } from "@remix-run/react";
import styles from "./publicLayout.module.css";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/propiedades", label: "Propiedades" },
  { to: "/vendedores", label: "Vendedores" },
  { to: "/blog", label: "Blog" },
];

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            Casa<span className={styles.brandAccent}>Nova</span>
          </Link>
          <nav className={styles.nav}>
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p>© {new Date().getFullYear()} CasaNova — Inmobiliaria</p>
        </div>
      </footer>
    </div>
  );
}
