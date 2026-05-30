import React, { useState, useRef, useEffect } from "react";
import styles from "./dropdownSelect.module.css";
import { Label, Spacer, Text } from "../atoms";
import { BaseFieldProps } from "~/admin/interfaces";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
export interface OptionDropdownSelect {
  value: string;
  label: string;
}

interface DropdownSelectProps extends BaseFieldProps {
  options: OptionDropdownSelect[];
  onChange: (value?: any) => void;  
  value?: string;
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
  error = "",
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
      if (isOpen && dropdownRef.current && dropdownMenuRef.current) {
        const inputRect = dropdownRef.current.getBoundingClientRect();
        const calendarHeight = dropdownMenuRef.current.offsetHeight || 300; // Estimación de altura si no se calcula
        const spaceBelow = window.innerHeight - inputRect.bottom;
        const shouldOpenUpward = spaceBelow < calendarHeight;
  
        if (shouldOpenUpward) {
          dropdownMenuRef.current.style.top = `-${calendarHeight + 5}px`;
        } else {
          dropdownMenuRef.current.style.top = '100p%';
        }
      }
    }, [isOpen]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (option: OptionDropdownSelect) => {
    setInternalValue(option?.value);
    setIsOpen(false);
    onChange({name, value: option?.value})
  };
  const handleCliclClean = () => {
    setInternalValue('')
    onChange({name, value: ''})

  }
  const selectedOption = options?.find((opt) => opt?.value === internalValue);

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <Label
        required={required}
        label={label}
      />
      <div className={styles.wrapper} ref={dropdownRef}>
        <div
          className={`${error && styles.errorSelect} ${styles.select}`}
          onClick={handleToggle}
        >
          <Text as="span" size="14" className={styles.text}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <div className={styles.divBtns}>           
            {
              internalValue !== '' ? (<button
                type="button"
                className={styles.btnClean}
                onClick={handleCliclClean}
                style={{ padding: '8px', width: '44px' }}
              >
                <IoIosClose />
              </button>) : <></>
            }
            <span className={`${styles.caret} ${isOpen ? styles.caretOpen : ""}`}>
              <MdKeyboardArrowDown />
            </span>
          </div>
        </div>
        {isOpen && (
          <div className={styles.options} ref={dropdownMenuRef}>
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
