import React, { ChangeEvent, useEffect } from 'react';
import { useFetcher } from '@remix-run/react';
import { IField } from '~/admin/interfaces';
import { Checkbox, Input, InputNumber, RadioButton, TextArea, Toggle } from '../atoms';
import styles from "./fieldFactory.module.css";
import RichTextEditor from '../molecules/RichTextEditor';
import { DatePicker, DropDownMultipleSelect, DropdownSelect } from '../molecules';
import { ArrayField } from './ArrayField';
import { MediaPicker } from './MediaPicker';

type OnChangeInput =
  | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  | { name: string; value: any };

interface FieldProps {
  field: IField;
  name?: string;
  value?: any;
  onChange: (value: OnChangeInput) => void;
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
  richText: ({ field, name, value, onChange }) => (
    <RichTextEditor
      value={Array.isArray(value) ? value : undefined}
      onChange={(newValue) => onChange({ name: name ?? field.name, value: newValue })}
    />
  ),
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
  relationship: ({ field, name, value, onChange }) => {
    if (field.type !== 'relationship') return null;

    const fetcher = useFetcher<{ options: { value: string; label: string }[] }>();

    useEffect(() => {
      if (fetcher.state === 'idle' && !fetcher.data) {
        fetcher.load(`/admin/relationship-options/${field.relationTo}`);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field.relationTo]);

    const options = fetcher.data?.options ?? [];

    return field.multiple ? (
      <DropDownMultipleSelect
        options={options}
        name={name ?? field.name}
        label={field.label}
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
        required={field.required}
      />
    ) : (
      <DropdownSelect
        options={options}
        name={name ?? field.name}
        label={field.label}
        value={typeof value === 'string' ? value : ''}
        onChange={onChange}
        required={field.required}
      />
    );
  },
  array: ({ field, name, value, onChange}) => {
    if (field.type !== 'array') return null;

    return (
      <ArrayField 
        onChange={onChange}
        fields={field.fields}
        value={value || []}
        label={field.label}
        name={name ?? field.name}
        min={field.minItems}
        max={field.maxItems}
        required={field.required}
      />
    )
  },
  upload: ({ field, name, value, onChange }) => {
    if (field.type !== 'upload') return null;

    // No es un <input type="file"> ni un relationship: "upload" guarda una
    // URL (string) de un archivo YA subido a Media (tabla Prisma separada
    // de Entry, por eso no puede modelarse como relationship). MediaPicker
    // abre un selector visual sobre /admin/media-options y escribe esa URL
    // en el campo — mismo dato que antes, ahora elegido en vez de tipeado.
    return (
      <MediaPicker
        label={field.label}
        name={name ?? field.name}
        value={typeof value === 'string' ? value : ''}
        onChange={onChange}
        required={field.required}
        allowedTypes={field.allowedTypes}
      />
    );
  },
  // Para "group", lo implementamos más adelante
};

export const FieldFactory: React.FC<FieldProps> = ({ field, name, value = "", onChange }) => {
  const Component = fieldComponents[field.type] || fieldComponents['text'];
  return (
    <div className={styles.component}>
      <Component field={field} value={value } name={name} onChange={onChange} />
    </div>
  );
};