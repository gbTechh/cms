import styles from "./dropdownmenu.module.css"; // Importa tus estilos
import { MdKeyboardArrowDown } from "react-icons/md";
import { Spacer, Text } from "../atoms";
import { useState } from "react";

interface DropDownMenuProps {
  title: string;
  children: React.ReactElement;
}

export function DropDownMenu({ title, children }: DropDownMenuProps) {
  const [active, setActive] = useState(true);

  return (
    <div className={styles.dropdown}>
      <button
        className={styles.button}
        onClick={() => {
          setActive(!active);
        }}
      >
        <Text as="span" size="14" color="contrast">
          {title}
        </Text>
        <MdKeyboardArrowDown
          width={50}
          height={50}
          className={`${styles.arrow} ${active ? styles.turn : ""}`}
        />
      </button>
      <Spacer y={1} />
      {active ? <ul>{children}</ul> : <></>}
    </div>
  );
}
