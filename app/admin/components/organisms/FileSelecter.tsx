import React, { useId } from "react";
import styles from "./fileSelecter.module.css";
import { Spacer, Text } from "../atoms";

interface FileSelectorProps {
  files: (File | string)[];
  onFilesSelected: (files: (File | string)[]) => void;
  maxFiles?: number;
  label?: string;
  acceptedTypes?: string[];
  name?: string;
}

export const FileSelector: React.FC<FileSelectorProps> = ({
  files,
  onFilesSelected,
  maxFiles = 15,
  label,
  acceptedTypes,
  name,
}) => {
  const id = useId();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = event.target.files;
    if (!incoming) return;
    const newFiles = Array.from(incoming);
    const merged = [...files, ...newFiles];
    if (merged.length <= maxFiles) {
      onFilesSelected(merged);
    } else {
      console.warn(`Límite de ${maxFiles} archivos excedido`);
    }
    // Allow re-selecting the same file next time
    event.target.value = "";
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const dropped = Array.from(event.dataTransfer.files).filter((file) =>
      acceptedTypes ? acceptedTypes.some((t) => file.type.startsWith(t)) : true
    );
    const merged = [...files, ...dropped];
    if (merged.length <= maxFiles) {
      onFilesSelected(merged);
    } else {
      console.warn(`Límite de ${maxFiles} archivos excedido`);
    }
  };

  return (
    <div className={styles.container}>
      {label && (
        <Text className={styles.title} color="primary" size="input" type="title" fw="medium">
          {label}
        </Text>
      )}
      <div className={styles.dropzone} onDragOver={handleDragOver} onDrop={handleDrop}>
        <Text size="input">Arrastra los archivos aquí</Text>
        <Spacer y={1} />
        <input
          type="file"
          name={name}
          accept={acceptedTypes?.join(",")}
          multiple={maxFiles > 1}
          onChange={handleFileChange}
          className={styles.input}
          id={id}
        />
        <label htmlFor={id} className={styles.label}>
          <Text size="input" color="contrast" className={styles.labelText}>
            o haz click aquí para subir archivos
          </Text>
        </label>
      </div>
    </div>
  );
};
