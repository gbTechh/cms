import styles from "./aside.module.css";
import { Link, useLocation } from "@remix-run/react";
import { SiPayloadcms } from "react-icons/si";
import { Text, WrappIcon } from "../atoms";
import { ICollection } from "~/admin/interfaces";
import { DropDownMenu } from "../molecules";

interface Props {
  collections: ICollection[];
}

export function Aside({ collections }: Props) {
  const location = useLocation();

  return (
    <aside className={styles.aside}>
      <div className={styles.head}>
        <div className={styles.divIcon}>
          <WrappIcon>
            <SiPayloadcms />
          </WrappIcon>
        </div>
        <div>
          <Text size="sm" color="contrast">
            username
          </Text>
        </div>
      </div>
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
                <Link to={`collections/${e.slug}`}>
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
      </div>
    </aside>
  );
}
