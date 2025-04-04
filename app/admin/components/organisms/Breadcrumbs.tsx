import { Link, useLocation, useMatches } from "@remix-run/react";
import { useEffect, useState } from "react";
import styles from "./breadcrumbs.module.css"; // Importa tus estilos
import { MdNavigateNext } from "react-icons/md";
import { TbSmartHome } from "react-icons/tb";
import { Text } from "../atoms";

interface IBreadCrumb {
  breadcrumb: string;
  path: string;
  dynamic?: boolean;
}

export function Breadcrumbs() {
  const location = useLocation();
  const matches = useMatches(); // Hook para obtener las rutas coincidentes
  const [breadState, setBreadState] = useState<IBreadCrumb>(
    matches[matches.length - 1].handle as IBreadCrumb | (() => IBreadCrumb)
  );

  useEffect(() => {
    setBreadState(
      matches[matches.length - 1].handle as IBreadCrumb | (() => IBreadCrumb)
    );
  }, [matches]);

  useEffect(() => {
    if (breadState?.dynamic) {
      const dynamicPath = location.pathname.split("/").at(-1);
      setBreadState((prevState) => ({
        ...prevState,
        breadcrumb: `${prevState.breadcrumb}/${dynamicPath}`,
      }));
    }
  }, [location]);

  let pathAccumulative = "";
  return (
    <nav aria-label="breadcrumb">
      <ul className={styles.breadcrumbs}>
        {breadState?.breadcrumb?.split("/").map((e, i) => (
          <span className={styles.span} key={e}>
            <Link
              to={`/${(pathAccumulative +=
                breadState?.path?.split("/")[i] + "/")}`}
              className={styles.link}
            >
              {e !== "Home" ? (
                <Text
                  className={styles.textLink}
                  as="span"
                  size="input"
                  color={`${
                    i === breadState?.breadcrumb.split("/").length - 1
                      ? "primary"
                      : "contrast"
                  }`}
                >
                  {e}
                </Text>
              ) : (
                <TbSmartHome />
              )}
            </Link>

            {i === breadState?.breadcrumb.split("/").length - 1 ? (
              <></>
            ) : (
              <span className={styles.icon}>
                <MdNavigateNext />
              </span>
            )}
          </span>
        ))}
      </ul>
    </nav>
  );
}
