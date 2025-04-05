// app/routes/_layout.admin.tsx
import { ReactElement } from "react";
import { Aside, Breadcrumbs } from "~/admin/components";
import styles from "./layoutadmin.module.css";
import { ICollection } from "~/admin/interfaces";

interface Props {
  children: ReactElement;
  data: ICollection[];
}

export function LayoutAdmin({ children, data }: Props) {
  return (
    <div className={styles.container}>
      <Aside collections={data} />
      <main className={styles.main}>
        <div className={styles.header}>
          <Breadcrumbs />
        </div>
        <div className={styles.body}>{children}</div>
      </main>
    </div>
  );
}
