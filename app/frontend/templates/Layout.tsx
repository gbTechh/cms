import type { LinksFunction } from "@remix-run/node";
import { Nav, Footer } from "~/frontend/ui";
// `?url` en vez de un import de efecto: así el CSS se registra vía
// links() y Remix lo manda como <link rel="stylesheet"> en el SSR, en
// vez de que Vite lo inyecte por JS después de hidratar (eso causaba un
// flash de HTML sin estilos en cada carga/HMR). Activa Tailwind (Preflight
// incluido) solo en las rutas públicas — el admin (app/admin/**) jamás
// importa app/frontend/**, así que el reset de Tailwind nunca lo toca, y
// viceversa: ver app/frontend/theme.css.
import themeHref from "~/frontend/theme.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: themeHref }];

interface LayoutProps {
  children: React.ReactNode;
}

// Contenido específico de ESTE proyecto (spa de bienestar). Nav/Footer son
// genéricos — para otro cliente, esto es lo único que cambia acá.
const NAV_LINKS = [{ to: "/treatments", label: "Tratamientos" }];

const FOOTER_COLUMNS = [
  {
    heading: "Explorar",
    links: [{ to: "/treatments", label: "Tratamientos" }],
  },
];

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-pub-bg font-pub text-pub-text">
      <Nav
        brand={<>Aura<span className="text-pub-accent">Spa</span></>}
        links={NAV_LINKS}
      />

      <main className="flex-1">{children}</main>

      <Footer
        brand={<>Aura<span className="text-pub-accent">Spa</span></>}
        tagline="Tratamientos faciales, corporales y de relajación con especialistas dedicados a tu bienestar."
        columns={FOOTER_COLUMNS}
        contact={
          <>
            Av. Javier Prado Este 1234
            <br />
            San Isidro, Lima
            <br />
            +51 999 222 333
            <br />
            hola@auraspa.pe
          </>
        }
        bottomText={`© ${new Date().getFullYear()} Aura Spa`}
      />
    </div>
  );
}
