import { BaseFieldProps } from "~/admin/interfaces";
import { Text } from "./Text";
import styles from "./textarea.module.css"
import { useId } from "react";

interface TextAreaFieldProps extends BaseFieldProps {
  onChange: (e: any) => void;
  rows?: number;
  value?: string;
  maxLength?: number;
  readOnly?: boolean;
}

export const TextArea: React.FC<TextAreaFieldProps> = ({
  label = "",
  value,
  placeholder = "",
  name,
  className = "",
  labelClassName = "",
  labelColor = "primary",
  labelSize = "sm",
  error = "",
  labelFw = "normal",
  required = false,
  onChange,
  rows = 4,
  maxLength = 1000,
  readOnly = false,
}) => {
  const idInput = useId();

  const containerClasses = [styles.container, className].join(" ");
  const labelClasses = [styles.label, labelClassName].join(" ");
  const inputClasses = [styles.textarea, error ? styles.inputError : ""].join(" ");

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={idInput} className={labelClasses}>
          <Text color={labelColor} size={labelSize} type="title" fw={labelFw}>
            {label}
            {required ? <span className={styles.required}>*</span> : <></>}
          </Text>
        </label>
      )}

      <textarea
        id={idInput}
        name={name}
        placeholder={placeholder}
        className={inputClasses}
        rows={rows}
        maxLength={maxLength}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
      />
      <Text size="input" className={styles.length}>
        {value?.length}/{maxLength}
      </Text>
      {error && (
        <Text color="error" size="14" className={styles.errorText}>
          {error}
        </Text>
      )}
    </div>
  
  );
};