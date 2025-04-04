import { HTMLAttributes } from "react";
import styles from "./divider.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  w?: number;
  full?: boolean;
}

export function DividerX({ full = true, w = 0, ...props }: Props) {
  if (w > 0) {
    full = false;
  }
  return (
    <div
      {...props}
      style={{
        width: `${full ? "100%" : `${w}rem`}`,
      }}
      className={styles.divider}
    />
  );
}
