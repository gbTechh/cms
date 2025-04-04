import { HTMLAttributes } from "react";
import styles from "./divider.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  h?: number;
  full?: boolean;
}

export function DividerY({ full = true, h = 0, ...props }: Props) {
  if (h > 0) {
    full = false;
  }
  return (
    <span
      {...props}
      style={{
        height: `${full ? "100%" : `${h}rem`}`,
      }}
      className={styles.divider}
    />
  );
}
