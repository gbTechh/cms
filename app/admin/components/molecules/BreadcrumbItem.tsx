import { Link } from "@remix-run/react";
import styles from "./breadcrumbItem.module.css"; // Importa tus estilos
import { MdNavigateNext } from "react-icons/md";
import { Text } from "../atoms";

interface IBreadCrumbItem {
  to: string;
  text: string;
}

export function BreadcrumbItem({ to = "/", text }: IBreadCrumbItem) {
  return (
    <span className={styles.span}>
      <Link to={to} className={styles.link}>
        <Text
          className={styles.textLink}
          as="span"
          size="input"
          color={"contrast"}
        >
          {text}
        </Text>
      </Link>

      <span className={styles.icon}>
        <MdNavigateNext />
      </span>
    </span>
  );
}
