import { Spacer } from "./Spacer";
import { Text } from "./Text";
import styles from './label.module.css'

interface Props {
  label?: string
  idInput?: string;
  labelClassName?: string;
  type?: string;
  labelColor?:
  | "black"
  | "primary"
  | "contrast"
  | "error"
  | "success"
  | "warning"
  | "custom";
  labelSize?: "custom" | "sm" | "xl" | "lg" | "md" | "xs" | "14" | "input";
  labelFw?:
    | "thin"
    | "extralight"
    | "light"
    | "semilight"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold"
    | "black"
    | "extrablack";
  required?: boolean
  as?:  keyof JSX.IntrinsicElements;
}

export const Label = ({
  idInput, 
  label, 
  labelClassName,
  labelFw, 
  labelColor = "primary",
  labelSize = "sm",
  type = "text",
  required = false,
  as = "label"
  }: Props) => {

  const labelClasses = [
    styles.label,
    styles[`label-${type}`],
    labelClassName,
  ].join(" ");
  return (
    <>
      {label && (
       <>
         <Text as={as} htmlFor={idInput} className={labelClasses}>
            <Text color={labelColor} size={labelSize} type="title" fw={labelFw}>
              {label}
              {required ? <span className={styles.required}>*</span> : (<></>)}
            </Text>
          </Text>
          <Spacer y={1}/>
       </>
      )}
    </>
  )
}
