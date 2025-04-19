import React, { useId, useState } from "react";
import styles from "./fileSelecter.module.css";
import pdf from "../../assets/images/pdf.png";
import video from "../../assets/images/video.png";
import noImage from "../../assets/images/no-image.jpg";
import { Spacer, Text } from "../atoms";

interface FileSelectorProps  {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  data?: (string | File)[];
  label?: string;
  acceptedTypes?: string[];
}

export const FileSelector: React.FC<FileSelectorProps> = ({
  onFilesSelected,
  maxFiles = 15,
  data = [],
  label,
  acceptedTypes,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<(File | string)[]>(data);
  const id = useId();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      if (selectedFiles.length + newFiles.length <= maxFiles) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
        onFilesSelected([...selectedFiles, ...newFiles] as File[]);
      } else {
        console.log(`Has excedido el límite de ${maxFiles} archivos`);
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, i) => i !== index);
      onFilesSelected(newFiles as File[]);
      return newFiles;
    });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files).filter((file) =>
      acceptedTypes?.some((type) => file.type.startsWith(type))
    );
    if (selectedFiles.length + droppedFiles.length <= maxFiles) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
      onFilesSelected([...selectedFiles, ...droppedFiles] as File[]);
    } else {
      console.log(`Has excedido el límite de ${maxFiles} archivos`);
    }
  };

  const getFileName = (file: string | File) => {
    if (typeof file === "string") {
      const str = file.split("/");
      return str[str.length - 1];
    }
    return file.name;
  };

  const getFilePreview = (file: string | File) => {
    if (typeof file === "string" && file.startsWith("http")) {
      return file; // URL de imagen existente
    }
    if (file instanceof File && file.type.startsWith("image")) {
      return URL.createObjectURL(file);
    }
    // Placeholders para otros tipos de archivos
    if (file instanceof File) {
      if (file.type.startsWith("video")) return video;
      if (file.type === "application/pdf") return pdf;
    }
    return noImage;
  };

  return (
    <div className={styles.container}>
      {label && (
        <Text
          className={styles.title}
          color={"primary"}
          size={"input"}
          type="title"
          fw={"medium"}
        >
          {label}
        </Text>
      )}
      <div
        className={styles.dropzone}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Text size="input">Arrastra los archivos aquí</Text>
        <Spacer y={1} />
        <input
          type="file"
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
      {/* <div className={styles.fileGallery}>
        {selectedFiles.map((file, index) => (
          <div key={index} className={styles.fileItem}>
            <img
              src={getFilePreview(file)}
              alt={getFileName(file)}
              className={styles.filePreview}
            />
            <Text size="input" color="contrast" className={styles.fileName}>
              {getFileName(file)}
            </Text>
            <button
              type="button"
              onClick={() => handleRemoveFile(index)}
              className={styles.removeButton}
            >
              <Text size="input" color="error">
                Eliminar
              </Text>
            </button>
          </div>
        ))}
      </div> */}
    </div>
  );
};
