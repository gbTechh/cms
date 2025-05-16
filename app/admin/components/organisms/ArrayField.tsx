import React, { useState } from "react";
import { Text } from "../atoms";
import { BaseFieldProps, IField } from "~/admin/interfaces";
import { IoAddCircleOutline } from "react-icons/io5";
import styles from "./arrayfield.module.css";
import { FieldFactory } from "./FieldFactory";

// Generar un identificador único para cada fila
const generateRowId = (index: number) => `row${index + 1}`;

interface Props extends BaseFieldProps {
  fields: IField[] | [];
  min?: number;
  max?: number;
  initialData?: { [key: string]: any }; // Datos iniciales desde la base de datos
  onChange: (value: any) => void;
}

export const ArrayField: React.FC<Props> = ({
  label = "",
  name,
  min,
  max,
  fields,
  onChange,
  required = false,
  initialData = {},
}) => {
  // Inicializar el estado local 'rows' con los datos iniciales
  const [rows, setRows] = useState<{ id: string; data: any }[]>(
    Object.entries(initialData).map(([id, data]) => ({ id, data }))
  );

  // Validar el número de filas
  const validateRows = (): string | boolean => {
    const rowCount = rows.length;
    if (required && rowCount < 1) return "Este campo es requerido.";
    if (min && rowCount < min) return `Mínimo ${min} filas requeridas.`;
    if (max && rowCount > max) return `Máximo ${max} filas permitidas.`;
    return true;
  };

  // Agregar una nueva fila
  const handleAddRow = () => {
    const rowCount = rows.length;
    if (max && rowCount >= max) {
      console.warn(`No se pueden añadir más filas. Límite: ${max}`);
      return;
    }
    const newRowId = generateRowId(rowCount);
    const newRowData = fields.reduce((acc, field) => {
      const defaultValue = field.type === "array" ? {} : field.defaultValue ?? "";
      return { ...acc, [field.name]: defaultValue };
    }, {});
    const newRows = [...rows, { id: newRowId, data: newRowData }];
    setRows(newRows);
  };

  // Eliminar una fila
  const handleRemoveRow = (rowId: string) => {
    const newRows = rows.filter((row) => row.id !== rowId);
    setRows(newRows);
  };

  // Manejar cambios en los campos de una fila
  const handleFieldChange = (rowId: string, fieldName: string, value: any) => {
    const newRows = rows.map((row) =>
      row.id === rowId ? { ...row, data: { ...row.data, [fieldName]: value } } : row
    );
    setRows(newRows);
    onChange({name: fieldName, value: newRows})
  };

  // Reordenar filas
  const moveRow = (fromIndex: number, toIndex: number) => {
    const newRows = [...rows];
    const [movedRow] = newRows.splice(fromIndex, 1);
    newRows.splice(toIndex, 0, movedRow);
    setRows(newRows);
  };

  // Transformar rows en el formato para la base de datos
  const getDataForDatabase = () => {
    return rows.reduce((acc, row) => ({ ...acc, [row.id]: row.data }), {});
  };

  // Renderizar cada fila
  const renderRow = (row: { id: string; data: any }, index: number) => (
    <div
      key={row.id}
      style={{ marginBottom: "10px", border: "1px solid #ccc", padding: "10px" }}
    >
      {fields?.map((field) => {
        const fieldName = `${name}.${row.id}.${field.name}`;
        return (
          <FieldFactory
            key={fieldName}
            name={fieldName}
            field={field}
            value={row.data[field.name] || (field.type === "array" ? {} : field.defaultValue ?? "")}
            //onChange={(value: any) => handleFieldChange(row.id, field.name, value)}
            onChange={onChange}
          />
        );
      })}
      <button type="button" onClick={() => handleRemoveRow(row.id)}>
        Eliminar
      </button>
      {index > 0 && (
        <button type="button" onClick={() => moveRow(index, index - 1)}>
          Mover arriba
        </button>
      )}
      {index < rows.length - 1 && (
        <button type="button" onClick={() => moveRow(index, index + 1)}>
          Mover abajo
        </button>
      )}
    </div>
  );

  // Depuración
  console.log("rows:", rows);
  console.log("Data for database:", getDataForDatabase());

  return (
    <div>
      {label && <Text size="md">{label}</Text>}
      {rows.map(renderRow)}
      <button className={styles.btnAdd} onClick={handleAddRow} type="button">
        <IoAddCircleOutline className={styles.icon} />
        {`Agregar ${name}`}
      </button>
      {validateRows() !== true && (
        <Text size="sm" color="error">
          {validateRows()}
        </Text>
      )}
    </div>
  );
};