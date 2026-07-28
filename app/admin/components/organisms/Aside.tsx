import styles from "./aside.module.css";
import { Form, Link, useLocation } from "@remix-run/react";
import { SiPayloadcms } from "react-icons/si";
import { IoLogOutOutline, IoPeopleOutline } from "react-icons/io5";
import { Button, Text, WrappIcon } from "../atoms";
import { ICollection, IUserSession } from "~/admin/interfaces";
import { DropDownMenu } from "../molecules";
import { ROUTES } from "~/admin/constants";
import { CsrfInput } from "~/admin/lib";

interface Props {
  collections: ICollection[];
  currentUser: IUserSession;
}

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

export function Aside({ collections, currentUser }: Props) {
  const location = useLocation();

  return (
    <aside className={styles.aside}>
      {/* ── Logo ── */}
      <div className={styles.head}>
        <div className={styles.divIcon}>
          <Link to={ROUTES.ADMIN}>
            <WrappIcon>
              <SiPayloadcms />
            </WrappIcon>
          </Link>
        </div>
        <div className={styles.headInfo}>
          <Text size="sm" as="p" color="contrast" fw="medium">
            {currentUser.name}
          </Text>
          <Text size="xs" as="p" color="primary">
            {currentUser.email}
          </Text>
        </div>
      </div>

      {/* ── Navegación principal ── */}
      <div className={styles.content}>
        <DropDownMenu title="Colecciones">
          <ul className={styles.ul}>
            {collections?.map((e, i) => (
              <li
                key={i}
                className={
                  location.pathname.includes(e.slug)
                    ? styles.activeLink
                    : styles.li
                }
              >
                <Link to={`${ROUTES.COLLECTIONS}/${e.slug}`}>
                  <Text
                    as="span"
                    type="base"
                    size="14"
                    color="primary"
                    className={styles.text}
                  >
                    {e.name}
                  </Text>
                </Link>
              </li>
            ))}
          </ul>
        </DropDownMenu>

        {/* ── Configuración ── */}
        <div className={styles.settingsSection}>
          <Link
            to={ROUTES.USERS}
            className={
              location.pathname.startsWith(ROUTES.USERS)
                ? `${styles.settingsLink} ${styles.settingsLinkActive}`
                : styles.settingsLink
            }
          >
            <IoPeopleOutline className={styles.settingsIcon} />
            <Text as="span" size="14" color="primary" className={styles.text}>
              Usuarios
            </Text>
          </Link>
        </div>
      </div>

      {/* ── Footer: usuario + logout ── */}
      <div className={styles.footer}>
        <div className={styles.userBadge}>
          <div className={styles.avatar}>{initials(currentUser.name)}</div>
          <div className={styles.userInfo}>
            <Text size="xs" color="contrast" fw="medium" className={styles.truncate}>
              {currentUser.name}
            </Text>
            <Text size="xs" color="primary" className={styles.truncate}>
              {currentUser.email}
            </Text>
          </div>
        </div>
        <Form method="post" action={`${ROUTES.ADMIN}/logout`}>
          <CsrfInput />
          <Button
            type="submit"
            variant="ghost"
            color="black"
            size="extrasmall"
            className={styles.logoutBtn}
            title="Cerrar sesión"
          >
            <IoLogOutOutline />
          </Button>
        </Form>
      </div>
    </aside>
  );
}
