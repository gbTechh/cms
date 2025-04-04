import React from "react";
import styles from "./text.module.css";

type TextElement = keyof JSX.IntrinsicElements;

type TextType = "big" | "title" | "subtitle" | "base" | "custom";
type TextColor =
  | "black"
  | "primary"
  | "contrast"
  | "error"
  | "success"
  | "warning"
  | "custom"
  | "white";
type TextSize = "xl" | "lg" | "md" | "sm" | "xs" | "custom" | "14" | "input";
type FontWeight =
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

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: TextElement;
  children: React.ReactNode;
  type?: TextType;
  color?: TextColor;
  size?: TextSize;
  fw?: FontWeight;
  className?: string;
}

export const Text: React.FC<TextProps> = ({
  as = "p",
  children,
  type = "base",
  color = "primary",
  size = "md",
  fw = "normal",
  className = "",
  ...props
}) => {
  const classNames = [
    styles.text,
    styles[fw],
    styles[type],
    styles[color],
    styles[size === "14" ? "size14" : size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return React.createElement(as, { className: classNames, ...props }, children);
};
