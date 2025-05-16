import React from 'react';
import { IField, SelectField } from '~/admin/interfaces';
import { Checkbox, Input, InputNumber, RadioButton, TextArea, Toggle } from '../atoms';
import styles from "./fieldFactory.module.css";
import RichTextEditor from '../molecules/RichTextEditor';
import { DatePicker, DropDownMultipleSelect, DropdownSelect } from '../molecules';
import { ArrayField } from './ArrayField';

interface FieldProps {
  field: IField;
  name?: string;
  value?: any;
  onChange: (value: any) => void;
}

const fieldComponents: { [key: string]: React.FC<FieldProps> } = {
  text: ({ field, name, value, onChange }) => (
    <Input
      type="text"
      label={field.label}
      name={name ?? field.name}
      value={value || ''}
      onChange={onChange}
      required={field.required}
      placeholder={field.label}
    />
  ),
  textarea: ({ field, name, value, onChange }) => (
    <TextArea
      name={name ?? field.name}
      label={field.label}
      value={value || ''}
      onChange={onChange}
      required={field.required}
      placeholder={field.label}
    />
  ),
  number: ({ field, name, value, onChange }) => (
    <InputNumber
      type='text'
      label={field.label}
      name={name ?? field.name}
      value={value || ''}
      onChange={onChange}
      required={field.required}
      placeholder={field.label}
      min={(field as any).min}
      max={(field as any).max}
      step={(field as any).step}
    />    
  ),
  toggle: ({ field, name, value, onChange }) => (
    <Toggle
      label={field.label}
      name={name ?? field.name}
      value={value} // Valor controlado desde el padre
      onChange={onChange}
    />
  ),
  checkbox: ({ field, name, value, onChange }) => (
    <Checkbox
      label={field.label}
      name={name ?? field.name}
      isChecked={value} // Valor controlado desde el padre
      onChange={onChange}
    />
  ),
  radio: ({ field, name, value, onChange }) => {
    // Verifica que el campo sea de tipo SelectField
    if (field.type !== 'radio') return null;
    
    return (
      <RadioButton
        options={field.options} // Ahora TypeScript sabe que field es SelectField
        name={name ?? field.name}
        label={field.label}
        value={value || ''}
        onChange={onChange}
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
  date: ({ field, name, value, onChange }) => (
    <DatePicker
      label={field.label}
      name={name ?? field.name}
      value={value}
      onChange={onChange}
      required={field.required}
      formatType={(field as any).format}
    />
  ),
  select: ({ field, name, value, onChange }) => {
    // Verifica que el campo sea de tipo SelectField
    if (field.type !== 'select') return null;
    
    return (
      <>
        {
          field.hasMany ? 
          (<DropDownMultipleSelect
            options={field.options} // Ahora TypeScript sabe que field es SelectField
            name={name ?? field.name}
            label={field.label}
            value={value || []}
            onChange={(value) => onChange(value)}
            required={field.required}
          />) : 
          (<DropdownSelect
            options={field.options} // Ahora TypeScript sabe que field es SelectField
            name={name ?? field.name}
            label={field.label}
            value={value || []}
            onChange={(value) => onChange(value)}
            required={field.required}
          />)
        }
      </>
    );
  },
  array: ({ field, name, value, onChange}) => {
    if (field.type !== 'array') return null;

    return (
      <ArrayField 
        fields={field.fields}
        label={field.label}
        name={name ?? field.name}
        min={field.minItems}
        max={field.maxItems}
        required={field.required}
      />
    )
  },
  upload: ({ field, name, value, onChange }) => (
    <input
      type="file"
      name={name ?? field.name}
      onChange={(e) => onChange(e.target.files?.[0])}
      required={field.required}
      accept={(field as any).allowedTypes?.join(',')}
    />
  ),
  // Para relationship, group, repeater, etc., los implementaremos más adelante
};

export const FieldFactory: React.FC<FieldProps> = ({ field, name, value = "", onChange }) => {
  const Component = fieldComponents[field.type] || fieldComponents['text'];
  return (
    <div className={styles.component}>
      <Component field={field} value={value } name={name} onChange={onChange} />
    </div>
  );
};