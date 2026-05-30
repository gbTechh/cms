import { ReactElement } from "react";
import { Aside, Breadcrumbs } from "~/admin/components";
import styles from "./layoutadmin.module.css";
import { ICollection, IUserSession } from "~/admin/interfaces";

interface Props {
  children: ReactElement;
  data: ICollection[];
  currentUser: IUserSession;
}

export function LayoutAdmin({ children, data, currentUser }: Props) {
  return (
    <div className={styles.container}>
      <Aside collections={data} currentUser={currentUser} />
      <main className={styles.main}>
        <div className={styles.header}>
          <Breadcrumbs />
        </div>
        <div className={styles.body}>{children}</div>
      </main>
    </div>
  );
}
