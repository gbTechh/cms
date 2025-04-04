// app/routes/_layout.admin.tsx
import { ReactElement } from "react";
import { Aside, Breadcrumbs } from "~/admin/components";
import styles from "./layoutadmin.module.css";

interface Props {
  children: ReactElement;
}

export function LayoutAdmin({ children }: Props) {
  return (
    <div className={styles.container}>
      <Aside collections={[]} />
      <main className={styles.main}>
        <div className={styles.header}>
          <Breadcrumbs />
        </div>
        <div className={styles.body}>{children}</div>
      </main>
    </div>
  );
}
