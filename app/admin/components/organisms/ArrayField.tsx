import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Input, Label, Spacer, Text } from "../atoms";
import { BaseFieldProps, IField } from "~/admin/interfaces";
import { IoAddCircleOutline } from "react-icons/io5";
import styles from './arrayfield.module.css'
import { FieldFactory } from "./FieldFactory";
import { useForm } from "~/hooks";


interface Props extends BaseFieldProps {
  fields: IField[] | [];
  min?: number;
  max?: number;
}

export const ArrayField: React.FC<Props> = ({
  label = "",
  name,
  min,
  max,
  fields,
  required = false
}) => {
  const initialState: {[key:string]: any} = {}
  const [rows, setRows] = useState<any[]>([]);
  const [formData, setFormData] = useState(initialState)

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateRows = (): string | boolean => {
    if (required && rows.length < 1) return 'Este campo es requerido.';
    if (min && rows.length < min) return `Mínimo ${min} filas requeridas.`;
    if (max && rows.length > max) return `Máximo ${max} filas permitidas.`;
    return true;
  };
  
  const handleAddRow = () => {
    if (max && rows.length >= max) {
      console.warn(`No se pueden añadir más filas. Límite: ${max}`);
      return;
    }
    const newRow = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
    setRows([...rows, newRow]);
  };

  // Eliminar una fila
  const handleRemoveRow = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };

  console.log({formData})


  // Renderizar cada fila
  const renderRow = (row: any, index: number) => (
    <div key={index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
      {
        fields?.map(field => {
          const nameField = `${name}[${index}][${field.name}]`
          return (
            (
              <FieldFactory
                key={field.name}
                name={nameField}
                field={field}
                value={formData[nameField] || (field.defaultValue ?? "")}
                onChange={(value: any) => handleChange(nameField, value)}
              />
            )
          )
        })
      }
      <button type="button" onClick={() => handleRemoveRow(index)}>Eliminar</button>
    </div>
  );

  return (
    <div>  
      {
        label && <Text size="md">{label}</Text>
      }    
      {rows.map(renderRow)}
      <button className={styles.btnAdd } onClick={handleAddRow} type="button"><IoAddCircleOutline className={styles.icon}/>{`Agregar ${name}`}</button>
    </div>
  );
};
