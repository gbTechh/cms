export interface BaseFieldProps {
  label?: string;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  error?: string | null;
  required?: boolean;
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
  name?: string;
}
