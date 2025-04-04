import styles from "./wrappIcon.module.css";

interface Props {
  children: React.ReactNode;
}

export const WrappIcon = ({ children }: Props) => {
  return <span className={styles.wrapp}>{children}</span>;
};
