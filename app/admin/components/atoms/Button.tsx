import React from "react";
import styles from "./button.module.css";

type ButtonSize = "extrasmall" | "small" | "medium" | "large";
type ButtonColor =
  | "primary"
  | "contrast"
  | "danger"
  | "success"
  | "warning"
  | "black";
type ButtonType = "button" | "submit" | "reset";
type ButtonVariant = "bordered" | "flat" | "ghost" | "solid";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  color?: ButtonColor;
  fullWidth?: boolean;
  children?: React.ReactNode;
  label?: string;
  type?: ButtonType;
  variant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({
  size = "medium",
  color = "primary",
  fullWidth = false,
  className = "",
  children,
  type = "button",
  label = "",
  disabled = false,
  variant = "solid",
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[size],
    styles[color],
    styles[variant],
    fullWidth ? styles.full : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={buttonClasses}
      type={type}
      disabled={disabled}
      {...props}
    >
      {label ? label : ""}
      {children}
    </button>
  );
};
