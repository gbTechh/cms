import React, { forwardRef, useId, Ref } from "react";
import { Text } from "..";
import { BaseFieldProps } from "~/admin/interfaces";
import styles from "./inputnumber.module.css";

interface Props extends BaseFieldProps {
  type: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (e: any) => void;
}

export const InputNumber = forwardRef<HTMLInputElement, Props>(
  (
    {
      type = "number",
      placeholder,
      label = "",
      name,
      className = "",
      labelClassName = "",
      labelColor = "primary",
      labelSize = "sm",
      error = "",
      labelFw = "normal",
      required = false,
      min,
      max,
      step = 1,
      value,
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
    ].join(" ");

    const adjustPrecision = (num: number, step: number | string) => {
      const stepDecimals = step.toString().split('.')[1]?.length || 0;
      return parseFloat(num.toFixed(stepDecimals));
    };
    
    const handleIncrement = () => {
      if (onChange) {
        const currentValue = Number(value) || 0;
        const newValueRaw = currentValue + Number(step);
        const adjustedValue = adjustPrecision(newValueRaw, step);
        const newValue = max !== undefined 
          ? Math.min(adjustedValue, Number(max)) 
          : adjustedValue;
        
        onChange({
          target: { name: name || "", value: newValue.toString() },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };
    
    const handleDecrement = () => {
      if (onChange) {
        const currentValue = Number(value) || 0;
        const newValueRaw = currentValue - Number(step);
        const adjustedValue = adjustPrecision(newValueRaw, step);
        const newValue = min !== undefined 
          ? Math.max(adjustedValue, Number(min)) 
          : adjustedValue;
        
        onChange({
          target: { name: name || "", value: newValue.toString() },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={idInput} className={labelClasses}>
            <Text color={labelColor} size={labelSize} type="title" fw={labelFw}>
              {label}
              {required ? <span className={styles.required}>*</span> : null}
            </Text>
          </label>
        )}
        <div className={styles.wrapInput}>
          <input
            {...props}
            ref={ref}
            id={idInput}
            name={name}
            type="number"
            placeholder={placeholder}
            className={inputClasses}
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
          />
          <div className={styles.buttonsContainer}>
            <button
              type="button"
              onClick={handleIncrement}
              className={styles.stepButton}
              aria-label="Incrementar"
            >
              +
            </button>
            <button
              type="button"
              onClick={handleDecrement}
              className={styles.stepButton}
              aria-label="Disminuir"
            >
              -
            </button>
          </div>
        </div>
        {error && (
          <Text color="error" size="14" className={styles.errorText}>
            {error}
          </Text>
        )}
      </div>
    );
  }
);

InputNumber.displayName = "InputNumber";