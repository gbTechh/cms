import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import styles from "./dropdownmultipleselect.module.css";
import { Input, Label, Spacer, Text } from "../atoms";
import { BaseFieldProps } from "~/admin/interfaces";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { OptionDropdownSelect } from "./DropDownSelect";


interface DropdownSelectProps extends BaseFieldProps {
  options: OptionDropdownSelect[] | [];
  onChange: (value: any) => void;  
  value?: string;
}

export const DropDownMultipleSelect: React.FC<DropdownSelectProps> = ({
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
  const [optionsState, setOptionsState] = useState<OptionDropdownSelect[] | []>(options);
  const [internalValue, setInternalValue] = useState<OptionDropdownSelect[] | []>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(value){
      const newValue = optionsState.find(e => e.value === value) as OptionDropdownSelect
      setInternalValue([newValue]);
      removeItemById(value)
    }
  }, [value,options]);

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
  const filteredOptions = optionsState.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useLayoutEffect(() => {
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
    }, [isOpen, optionsState, filteredOptions]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (option: OptionDropdownSelect) => {
    const newValue = optionsState.find(e => e.value === option?.value) as OptionDropdownSelect
    const filterValue = internalValue.some(e => e.value === newValue.value)
    if(!filterValue) {
      setInternalValue(prevItems => [...prevItems, newValue]);
    }
    removeItemById(option.value)
    setIsOpen(false);
    setSearchTerm("");
  };
  const handleCliclClean = () => {
    setInternalValue([])
    setOptionsState(options)
  }

  const removeItemById = (value: string) => {
    setOptionsState(prevItems => prevItems.filter(item => item.value !== value));
  };

  const handleRemoveItem = (item: OptionDropdownSelect) => {
    setInternalValue(prevItems => prevItems.filter(e => e.value !== item.value));
    setOptionsState(prevItems => [...prevItems, item]);
  }
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsOpen(true);
    setSearchTerm(event.target.value);
  }

  
  console.log({internalValue})
  return (
    <div>      
      <Label
        required={required}
        label={label}
      />
      <div className={styles.wrapper} ref={dropdownRef}>
        <div
          className={`${error && styles.errorSelect} ${styles.select}`}
          onClick={handleToggle}
        > 
          <div className={styles.wrapSelected}>
          {
            internalValue.map(e => (
              <Text onClick={() => handleRemoveItem(e)} key={e?.value} as="span" size="input" className={styles.spanText}>
                {e?.label}
              </Text>
            ))
          }
          <Input 
            autoComplete="off"
            autoCorrect="off" 
            inputClassName={styles.inputSearch} 
            value={searchTerm} 
            onChange={handleSearchInput}
            placeholder="Busca o selecciona una opcion"
          />
          </div>

          <div className={styles.divBtns}>           
            {
              internalValue.length > 0 ? (<button
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
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`${styles.option}`}
                onClick={() => handleSelect(option)}
              >
                <Text size="input">{option.label}</Text>
              </div>
            ))}
            {
              filteredOptions.length <= 0 ? ( <div
                className={`${styles.option}`}
               
              >
                <Text size="input">No hay opciones</Text>
              </div>) : (<></>)
            }
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
