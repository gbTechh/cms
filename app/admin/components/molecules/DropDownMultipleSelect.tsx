import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import styles from "./dropdownmultipleselect.module.css";
import { Input, Label, Spacer, Text } from "../atoms";
import { BaseFieldProps } from "~/admin/interfaces";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { OptionDropdownSelect } from "./DropDownSelect";

interface DropdownSelectProps extends BaseFieldProps {
  options: OptionDropdownSelect[] | [];
  onChange: (value: { name: string; value: any } | any) => void;
  value?: string[];
  name: string
}

export const DropDownMultipleSelect: React.FC<DropdownSelectProps> = ({
  options,
  onChange,
  placeholder = "Select an option",
  value = [],
  label = "",
  labelColor = "primary",
  labelSize = "14",
  labelFw = "normal",
  name,
  error = "",
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [optionsState, setOptionsState] = useState<OptionDropdownSelect[]>(options);
  const [internalValue, setInternalValue] = useState<OptionDropdownSelect[]>(
    options.filter((opt) => value.includes(opt.value))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  // Synchronize internalValue with value prop when it changes
  useEffect(() => {
    const selectedOptions = options.filter((opt) => value.includes(opt.value));
    setInternalValue(selectedOptions);
    // Update optionsState to exclude selected items
    setOptionsState(options.filter((opt) => !value.includes(opt.value)));
  }, [value, options]);

  // Handle clicks outside to close dropdown
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

  //  useLayoutEffect(() => {
  //     if (isOpen && dropdownRef.current && dropdownMenuRef.current) {
  //       const inputRect = dropdownRef.current.getBoundingClientRect();
  //       const calendarHeight = dropdownMenuRef.current.offsetHeight || 300; // Estimación de altura si no se calcula
  //       const spaceBelow = window.innerHeight - inputRect.bottom;
  //       const shouldOpenUpward = spaceBelow < calendarHeight;
  //       if (shouldOpenUpward) {
  //         dropdownMenuRef.current.style.top = `-${calendarHeight + 5}px`;
  //       } else {
  //         dropdownMenuRef.current.style.top = '100p%';
  //       }
  //     }
  //   }, [isOpen, optionsState, searchTerm, internalValue, filteredOptions]);


  // Position dropdown menu
  useLayoutEffect(() => {
    if (isOpen && dropdownRef.current && dropdownMenuRef.current) {
      const menu = dropdownMenuRef.current;
      menu.style.display = "none";
      menu.offsetHeight; // Trigger reflow
      menu.style.display = "block";

      const inputRect = dropdownRef.current.getBoundingClientRect();
      const menuHeight = menu.offsetHeight;
      const spaceBelow = window.innerHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;

      if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
        menu.style.top = `-${menuHeight + 5}px`;
        menu.style.maxHeight = `${spaceAbove - 10}px`;
      } else {
        menu.style.top = "100%";
        menu.style.maxHeight = `${spaceBelow - 10}px`;
      }
    }
  }, [isOpen, optionsState, searchTerm]);

  const filteredOptions = optionsState.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (option: OptionDropdownSelect) => {
    if (!internalValue.some((e) => e.value === option.value)) {
      const newInternalValue = [...internalValue, option];
      setInternalValue(newInternalValue);
      setOptionsState(optionsState.filter((opt) => opt.value !== option.value));
      // Notify parent of change
      //onChange({ name, value: JSON.stringify(newInternalValue.map((e) => e.value)) });
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleCliclClean = () => {
    setInternalValue([]);
    setOptionsState(options);
    // Notify parent of change
    //onChange({ name, value: [] });
  };

  const handleRemoveItem = (item: OptionDropdownSelect) => {
    const newInternalValue = internalValue.filter((e) => e.value !== item.value);
    setInternalValue(newInternalValue);
    setOptionsState([...optionsState, item].sort((a, b) => a.label.localeCompare(b.label)));
    // Notify parent of change
    //onChange({ name, value: JSON.stringify(newInternalValue.map((e) => e.value)) });
  };

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsOpen(true);
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <Label required={required} label={label} />
      <input  onChange={onChange} type="hidden" value={JSON.stringify(internalValue.map(e => e.value))} name={name}/>
      <div className={styles.wrapper} ref={dropdownRef}>
        <div
          className={`${error && styles.errorSelect} ${styles.select}`}
          onClick={handleToggle}
        >
          <div className={styles.wrapSelected}>
            {internalValue.map((e, i) => (
              <Text
                key={i}
                onClick={(evt) => {
                  evt.stopPropagation(); // Prevent toggling dropdown
                  handleRemoveItem(e);
                }}
                as="span"
                size="input"
                className={styles.spanText}
              >
                {e.label}
              </Text>
            ))}
            <Input
              autoComplete="off"
              autoCorrect="off"
              inputClassName={styles.inputSearch}
              value={searchTerm}
              onChange={handleSearchInput}
              placeholder={internalValue.length === 0 ? placeholder : ""}
            />
          </div>
          <div className={styles.divBtns}>
            {internalValue.length > 0 && (
              <button
                type="button"
                className={styles.btnClean}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent toggling dropdown
                  handleCliclClean();
                }}
                style={{ padding: "8px", width: "44px" }}
              >
                <IoIosClose />
              </button>
            )}
            <span className={`${styles.caret} ${isOpen ? styles.caretOpen : ""}`}>
              <MdKeyboardArrowDown />
            </span>
          </div>
        </div>
        {isOpen && (
          <div className={styles.options} ref={dropdownMenuRef}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={styles.option}
                  onClick={() => handleSelect(option)}
                >
                  <Text size="input">{option.label}</Text>
                </div>
              ))
            ) : (
              <div className={styles.option}>
                <Text size="input">No hay opciones</Text>
              </div>
            )}
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