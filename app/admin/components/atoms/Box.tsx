import React, { HTMLAttributes, ReactNode } from "react";
import styles from "./box.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  width?: "auto" | "full" | "half" | number;
  height?: "auto" | "full" | "half" | number;
  background?: "light" | "none" | string;
  padding?: "none" | "small" | "medium" | "large" | string;
  borderRadius?: "small" | "medium" | "large" | string;
  borderColor?: string;
}

export const Box: React.FC<Props> = ({
  children,
  className = "",
  width = "auto",
  height = "auto",
  background = "light",
  padding = "medium",
  borderRadius = "medium",
  borderColor = "primary",
  ...props
}) => {
  const boxClasses = [
    styles.box,
    styles[`width-${width}`],
    styles[`height-${height}`],
    styles[`background-${background}`],
    styles[`padding-${padding}`],
    styles[`borderRadius-${borderRadius}`],
    styles[`borderColor-${borderColor}`],
    className,
  ];

  // Handle custom width, height, padding, borderRadius if provided as numbers or strings
  const customStyles: React.CSSProperties = {};
  if (typeof width === "number") customStyles.width = `${width}px`;
  if (typeof height === "number") customStyles.height = `${height}px`;
  if (!["small", "medium", "large"].includes(padding))
    customStyles.padding = padding;
  if (!["small", "medium", "large"].includes(borderRadius))
    customStyles.borderRadius = borderRadius;
  if (background !== "gradient" && background !== "none")
    customStyles.background = background;

  return (
    <div
      {...props}
      className={boxClasses.join(" ")}
      style={{ ...customStyles, ...props.style }}
    >
      {children}
    </div>
  );
};
