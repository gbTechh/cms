import { HTMLAttributes, useId } from "react";
import styles from "./checkbox.module.css";
import { Text } from "./Text";
import { BaseFieldProps } from "~/admin/interfaces";
import { Label } from "./Label";

interface Props extends BaseFieldProps {  
  w?: number;
  h?: number;
  isChecked?: boolean;
  onChange: (e: any) => void;
}

export function Checkbox({
  name = "",
  w = 8,
  h = 4,
  label = "",
  isChecked,
  onChange
}: Props) {

  const id = useId();
  return (
    <label className={styles.toggle}>
      <div className={styles.checkboxWrapper}>
        <span className={styles.checkbox}>
          <input
            type="checkbox"
            name={name}
            className={styles.srOnly}
            checked={isChecked}
            onChange={(ev) => onChange({name, value: ev.target.checked})}
          />
          <svg>
            <use xlinkHref="#checkbox" className={styles.checkbox}></use>
          </svg>
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
          <symbol id="checkbox" viewBox="0 0 22 22">
            <path
              fill="none"
              stroke="currentColor"
              d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
            />
          </symbol>
        </svg>
      </div>
      <Label 
        label={label}
        type="checkbox"       
        idInput={id}
        as="span"
      />
    
    </label>
  );
}

