import React, { useState, useRef, useEffect } from "react";
import styles from "./dropdownSelect.module.css";
import { Spacer, Text } from "../atoms";
export interface OptionDropdownSelect {
  value: string;
  label: string;
}

interface DropdownSelectProps {
  options: OptionDropdownSelect[];
  onChange: (value: string) => void;
  placeholder?: string;
  value?: string;
  name?: string;
  error?: string;
  label?: string | React.ReactNode;
  labelColor?: "black" | "primary" | "contrast" | "error" | "success" | "warning" | "custom";
  labelSize?: "custom" | "sm" | "xl" | "lg" | "md" | "xs" | "14";
  labelFw?: "thin" | "extralight" | "light" | "semilight" | "normal" | "medium" | "semibold" | "bold" | "extrabold" | "black" | "extrablack";
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({
  options,
  onChange,
  placeholder = "Select an option",
  value,
  label = "",
  labelColor = "primary",
  labelSize = "14",
  labelFw = "normal",
  name,
  error = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (option: OptionDropdownSelect) => {
    setInternalValue(option.value);
    setIsOpen(false);
    onChange(option.value);
  };

  const selectedOption = options?.find(opt => opt?.value === internalValue);
  return (
    <div>
      <input type="hidden" name={name} value={value} />
      {label && (
        <>
          <Text color={labelColor} fw={labelFw} size={labelSize}>
            {label}
          </Text>
          <Spacer y={1} />
        </>
      )}
      <div className={styles.wrapper} ref={dropdownRef}>
        <div
          className={`${error && styles.errorSelect} ${styles.select}`}
          onClick={handleToggle}
        >
          <Text as="span" size="input">
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <span className={`${styles.caret} ${isOpen ? styles.caretOpen : ""}`}>
            ▼
          </span>
        </div>
        {isOpen && (
          <div className={styles.options}>
            {options?.map((option) => (
              <div
                key={option.value}
                className={`${styles.option} ${
                  internalValue === option.value ? styles.selected : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                <Text size="input">{option.label}</Text>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && (
        <>
          <Spacer y={1} />
          <Text color="error" size="14" className={styles.errorText}>
            {error}
          </Text>
        </>
      )}
    </div>
  );
};