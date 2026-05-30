import React, { useState, useEffect } from "react";
import { Text } from "../atoms";
import { IoAddCircleOutline } from "react-icons/io5";
import styles from './arrayfield.module.css';
import { FieldFactory } from "./FieldFactory";
import { BaseFieldProps, IField } from "~/admin/interfaces";
import { MdOutlineTableRows } from "react-icons/md";
import { LuTrash2 } from "react-icons/lu";
import { CgMoveDown, CgMoveUp } from "react-icons/cg";

type OnChangeInput =
  | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  | { name: string; value: any };

const generateRowId = (index: number) => `row${index + 1}`;

interface Props extends BaseFieldProps {
  fields: IField[] | [];
  min?: number;
  max?: number;
  value: any[];
  onChange: (value: OnChangeInput) => void;
  name: string;
}

export const ArrayField: React.FC<Props> = ({
  label = "",
  name = "",
  max,
  onChange,
  value = [],
  fields,
  //required = false
}) => {
  // Convertir el valor en un formato manejable para el componente
  const [rows, setRows] = useState<{ id: string; data: any}[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };
  // Inicializar y sincronizar rows con el valor externo
  useEffect(() => {
    if (Array.isArray(value) && value.length > 0) {
      // Si ya hay valor, usar eso
      const rowsFromValue = value.map((rowData, index) => ({
        id: generateRowId(index),
        data: rowData,
        isExpanded: true
      }));
      setRows(rowsFromValue);
    } else if (rows.length === 0) {
      // Si no hay filas y no hay valor, inicializar vacío
      setRows([]);
    }
  }, [value]);

  // const toggleRowExpansion = (rowId: string) => {
  //   setRows(rows.map(row => 
  //     row.id === rowId 
  //       ? { ...row, isExpanded: !row.isExpanded } 
  //       : row
  //   ));
  // };
  // Agregar una nueva fila
  const handleAddRow = () => {
    const rowCount = rows.length;
    if (max && rowCount >= max) {
      console.warn(`No se pueden añadir más filas. Límite: ${max}`);
      return;
    }

    // Crear nueva fila con valores predeterminados
    const newRowId = generateRowId(rowCount);
    const newRowData = fields.reduce((acc, field) => {
      const defaultValue = field.type === "array" 
        ? [] 
        : field.type === "select" && field.hasMany 
          ? [] 
          : field.defaultValue ?? "";
      return { ...acc, [field.name]: defaultValue };
    }, {});
    
    const newRows = [...rows, { id: newRowId, data: newRowData, isExpanded: true }];
    setRows(newRows);
    
    // Notificar cambio al componente padre
    const newValue = newRows.map(row => row.data);
    onChange({ name, value: newValue });
  };

  // Eliminar una fila
  const handleRemoveRow = (rowId: string) => {
    const newRows = rows.filter((row) => row.id !== rowId);
    setRows(newRows);
    
    // Notificar cambio al componente padre
    const newValue = newRows.map(row => row.data);
    onChange({ name, value: newValue });
  };

  // Manejar cambios en los campos de una fila
  const handleFieldChange = (rowId: string, fieldName: string, fieldValue: any) => {
    const newRows = rows.map((row) =>
      row.id === rowId 
        ? { ...row, data: { ...row.data, [fieldName]: fieldValue } } 
        : row
    );
    setRows(newRows);
    
    // Notificar cambio al componente padre
    const newValue = newRows.map(row => row.data);
    onChange({ name, value: newValue });
  };

  // Reordenar filas
  const moveRow = (fromIndex: number, toIndex: number) => {
    const newRows = [...rows];
    const [movedRow] = newRows.splice(fromIndex, 1);
    newRows.splice(toIndex, 0, movedRow);
    setRows(newRows);
    
    // Notificar cambio al componente padre
    const newValue = newRows.map(row => row.data);
    onChange({ name, value: newValue });
  };

  // Renderizar cada fila
  const renderRow = (row: { id: string; data: any }, index: number) => (
    <div
      key={row.id}
      className={styles.boxArray}
    >
      <div
      role="button"
      tabIndex={0} // Permite que el div sea enfocable
      aria-expanded={expandedRows[row.id]} // Para accesibilidad
      className={`${styles.boxHead} ${styles.buttonReset}`}
     
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleRowExpansion(row.id);
        }
      }}
    >
        <button className={styles.btnTitle} onClick={() => toggleRowExpansion(row.id)}>
          <Text as="span" className={styles.title} fw="semibold" color="primary" size="input" type="base"><MdOutlineTableRows />{`Fila ${index +1}`}</Text>          
        </button>
        <div className={styles.divBtns}>          
          {index > 0 && (
            <button className={styles.btn} type="button" onClick={() => moveRow(index, index - 1)}>
              <CgMoveUp />
            </button>
          )}
          {index < rows.length - 1 && (
            <button className={styles.btn} type="button" onClick={() => moveRow(index, index + 1)}>
              <CgMoveDown />
            </button>
          )}
          <button className={`${styles.btnDeleteRow} ${styles.btn}`} type="button" onClick={() => handleRemoveRow(row.id)}>
            <LuTrash2 />
          </button>
        </div>
      </div>
      <div 
        className={styles.boxBody} 
        style={{ 
          display: expandedRows[row.id] ? "block" : "none", // Muestra/oculta el contenido
          transition: "all 0.3s ease" // Animación opcional
        }}
      >
        {fields?.map((field) => {
          // Crear un manejador específico para este campo en esta fila
          const handleChange = (input: OnChangeInput) => {
            let fieldValue;
            
            if ("target" in input) {
              fieldValue = input.target.value;
            } else {
              fieldValue = input.value;
            }
            
            handleFieldChange(row.id, field.name, fieldValue);
          };
          
          return (
            <FieldFactory
              key={`${row.id}-${field.name}`}
              name={`${name}-${row.id}-${field.name}`}
              field={field}
              value={row.data[field.name] ?? (
                field.type === "array" 
                  ? [] 
                  : field.type === "select" && field.hasMany 
                    ? [] 
                    : field.defaultValue ?? ""
              )}
              onChange={handleChange}
            />
          );
        })}
      </div>
     
    </div>
  );

  return (
    <div className={styles.wrap}>
      {label && <Text size="md">{label}</Text>}
      {rows.map(renderRow)}
      <Text>
        <button 
          className={styles.btnAdd} 
          onClick={handleAddRow} 
          type="button"
        >
          <IoAddCircleOutline className={styles.icon} />
          {`Agregar ${label || name}`}
        </button>
      </Text>
    </div>
  );
};