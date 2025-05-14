import { BaseFieldProps } from '~/admin/interfaces'
import styles from './radiobutton.module.css'
import { OptionDropdownSelect } from '../molecules';
import { Label } from './Label';
import { Text } from './Text';

interface Props extends BaseFieldProps {
  options: OptionDropdownSelect[];
  onChange: (value: any) => void;  
  value?: string;
}

export const RadioButton = ({
  label,
  options,
  value,
  name,
  required,
  onChange
}: Props) => {
  return (
    <div>
      <Label 
        label={label}
        required={required}
      />
      <ul className={styles.ul}>
        {options.map(option => (
          <label key={option.value} className={styles.radioOption}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className={styles.radioInput}
            />
            <span className={styles.customRadio}></span>
            <Text as="span" size='input'>{option.label}</Text>
          </label>
        ))}
      </ul>
    </div>
  )
}
