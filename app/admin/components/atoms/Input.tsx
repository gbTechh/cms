import React, { forwardRef, useId, Ref } from "react";
import { Text } from "..";
import styles from "./input.module.css";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  error?: string | null;
  required?: boolean;
  labelColor?:
    | "black"
    | "primary"
    | "contrast"
    | "error"
    | "success"
    | "warning"
    | "custom";
  labelSize?: "custom" | "sm" | "xl" | "lg" | "md" | "xs" | "14" | "input";
  labelFw?:
    | "thin"
    | "extralight"
    | "light"
    | "semilight"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold"
    | "black"
    | "extrablack";
  onChange?: (ev: any) => void
}

export const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      type = "text",
      placeholder,
      label = "",
      name,
      className = "",
      inputClassName = "",
      labelClassName = "",
      labelColor = "primary",
      labelSize = "sm",
      error = "",
      labelFw = "normal",
      required = false,
      onChange,
      ...props
    }: Props,
    ref: Ref<HTMLInputElement>
  ) => {
    const idInput = useId();

    const containerClasses = [
      styles.container,
      type === "checkbox" || type === "radio"
        ? styles.inlineContainer
        : styles.stackedContainer,
      className,
    ].join(" ");

    const labelClasses = [
      styles.label,
      styles[`label-${type}`],
      labelClassName,
    ].join(" ");

    const inputClasses = [
      styles.input,
      error ? styles.inputError : "",
      styles[`input-${type}`],
      inputClassName
    ].join(" ");


    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={idInput} className={labelClasses}>
            <Text color={labelColor} size={labelSize} type="title" fw={labelFw}>
              {label}
              {required ? <span className={styles.required}>*</span> : (<></>)}
            </Text>
          </label>
        )}
        
        <input
          {...props}
          ref={ref}
          id={idInput}
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          className={inputClasses}
        />
        {error && (
          <Text color="error" size="14" className={styles.errorText}>
            {error}
          </Text>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
