import { HTMLAttributes } from "react";
import styles from "./spacer.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  x?: number;
  y?: number;
}

export function Spacer({ x = 0, y = 0, ...props }: Props) {
  return (
    <div
      style={{
        marginLeft: `${x ? `calc(${x}rem / 2)` : `0px`}`,
        marginRight: `${x ? `calc(${x}rem / 2)` : `0px`}`,
        marginTop: `${y ? `calc(${y}rem / 2)` : `0px`}`,
        marginBottom: `${y ? `calc(${y}rem / 2)` : `0px`}`,
      }}
      {...props}
      className={styles.spacer}
    />
  );
}
