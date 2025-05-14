import React from 'react';
import { IField, SelectField } from '~/admin/interfaces';
import { Checkbox, Input, InputNumber, RadioButton, TextArea, Toggle } from '../atoms';
import styles from "./fieldFactory.module.css";
import RichTextEditor from '../molecules/RichTextEditor';
import { DatePicker, DropDownMultipleSelect, DropdownSelect } from '../molecules';

interface FieldProps {
  field: IField;
  value?: any;
  onChange: (value: any) => void;
}

const fieldComponents: { [key: string]: React.FC<FieldProps> } = {
  text: ({ field, value, onChange }) => (
    <Input
      type="text"
      label={field.label}
      name={field.name}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      required={field.required}
      placeholder={field.label}
    />
  ),
  textarea: ({ field, value, onChange }) => (
    <TextArea
      name={field.name}
      label={field.label}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      required={field.required}
      placeholder={field.label}
    />
  ),
  number: ({ field, value, onChange }) => (
    <InputNumber
      type='text'
      label={field.label}
      name={field.name}
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value))}
      required={field.required}
      placeholder={field.label}
      min={(field as any).min}
      max={(field as any).max}
      step={(field as any).step}
    />    
  ),
  toggle: ({ field, value, onChange }) => (
      <Toggle
        label={field.label}
        name={field.name}
        value={value} // Valor controlado desde el padre
        onChange={(e) => onChange(e.target.checked)}
      />
  ),
  checkbox: ({ field, value, onChange }) => (
      <Checkbox
        label={field.label}
        name={field.name}
        isChecked={value} // Valor controlado desde el padre
        onChange={(e) => onChange(e.target.checked)}
      />
  ),
  radio: ({ field, value, onChange }) => {
    // Verifica que el campo sea de tipo SelectField
    if (field.type !== 'radio') return null;
    
    return (
      <RadioButton
        options={field.options} // Ahora TypeScript sabe que field es SelectField
        name={field.name}
        label={field.label}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
      />
    );
  },
  // richText: ({ field, value, onChange }) => (
  //   <RichTextEditor
  //     value={Array.isArray(value) ? value : field.defaultValue}
  //     onChange={onChange}
  //   />
  // ),
  date: ({ field, value, onChange }) => (
    <DatePicker
      label={field.label}
      name={field.name}
      value={value}
      onChange={onChange}
      required={field.required}
      formatType={(field as any).format}
    />
  ),
  select: ({ field, value, onChange }) => {
    // Verifica que el campo sea de tipo SelectField
    if (field.type !== 'select') return null;
    
    return (
      <>
        {
          field.hasMany ? 
          (<DropDownMultipleSelect
            options={field.options} // Ahora TypeScript sabe que field es SelectField
            name={field.name}
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />) : 
          (<DropdownSelect
            options={field.options} // Ahora TypeScript sabe que field es SelectField
            name={field.name}
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />)
        }
      </>
    );
  },
  upload: ({ field, value, onChange }) => (
    <input
      type="file"
      name={field.name}
      onChange={(e) => onChange(e.target.files?.[0])}
      required={field.required}
      accept={(field as any).allowedTypes?.join(',')}
    />
  ),
  // Para relationship, group, repeater, etc., los implementaremos más adelante
};

export const FieldFactory: React.FC<FieldProps> = ({ field, value = "", onChange }) => {
  const Component = fieldComponents[field.type] || fieldComponents['text'];
  console.log('field:', {field});
  return (
    <div className={styles.component}>
      <Component field={field} value={value } onChange={onChange} />
    </div>
  );
};