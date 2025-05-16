import React from "react";
import styles from "./toggle.module.css";
import { Text } from "./Text";
import { BaseFieldProps } from "~/admin/interfaces";

interface Props extends BaseFieldProps {
  value?: boolean;
  onChange: (e: any) => void;
}

export function Toggle({
  name = "",
  label,
  value = false,
  labelClassName = "",
  labelColor = "primary",
  labelSize = "sm",
  error = "",
  labelFw = "normal",
  required = false,
  onChange,
  ...props
}: Props) {
  const idInput = React.useId();
  
  const labelClasses = [
    styles.label,
    labelClassName,
  ].join(" ");

  return (
    <div className={styles.container}>
      {label && (
        <div className={styles.divLabel}>
          <label htmlFor={idInput} className={labelClasses}>
            <Text color={labelColor} size={labelSize} type="title" fw={labelFw}>
              {label}
              {required ? <span className={styles.required}>*</span> : null}
            </Text>
          </label>
        </div>
      )}
      <label className={styles.toggle}>
        <input
          {...props}
          id={idInput}
          type="checkbox"
          name={name}
          className={styles.srOnly}
          checked={value}
          onChange={(ev) => onChange({name, value: ev.target.checked})}
        />
        <div
          className={`${styles.toggleBackground} ${
            value ? styles.checked : ""
          }`}
          style={{ width: "5.6rem", height: "2.8rem" }}
        ></div>
      </label>
      
      {error && (
        <Text color="error" size="14" className={styles.errorText}>
          {error}
        </Text>
      )}
    </div>
  );
}