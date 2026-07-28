import styles from './medianew.module.css'
import { Button, Input, Spacer, Text } from "../atoms";
import { useState } from "react";
import { FileSelector } from "../organisms";
import video from "../../assets/images/video.png";
import noImage from "../../assets/images/no-image.jpg";
import pdf from "../../assets/images/pdf.png";
import { IoClose } from "react-icons/io5";
import { useSubmit } from "@remix-run/react";
import { ICollection } from "~/admin/interfaces";
import { useCsrfToken } from "~/admin/lib";

interface Props {
  collection: ICollection;
}

export function MediaNew({ collection }: Props) {
  const submit = useSubmit();
  const csrfToken = useCsrfToken();
  const [selectedFiles, setSelectedFiles] = useState<(File | string)[]>([]);
  const [altText, setAltText] = useState("");

  const getFilePreview = (file: string | File) => {
    if (typeof file === "string" && file.startsWith("http")) return file;
    if (file instanceof File && file.type.startsWith("image")) {
      return URL.createObjectURL(file);
    }
    if (file instanceof File) {
      if (file.type.startsWith("video")) return video;
      if (file.type === "application/pdf") return pdf;
    }
    return noImage;
  };

  const getFileName = (file: string | File) =>
    typeof file === "string" ? file.split("/").pop()! : file.name;

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    const fd = new FormData();
    for (const file of selectedFiles) {
      if (file instanceof File) fd.append("files", file);
    }
    fd.append("altText", altText);
    fd.append("csrf", csrfToken);

    // Submit to the current route action (no explicit action URL needed)
    submit(fd, { method: "post", encType: "multipart/form-data" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.container}>
        <div className={styles.wrapTitle}>
          <Text size="big" color="white">{collection.name}</Text>
          <Spacer y={0.2} />
          <Text size="14" color="primary">Subir archivos a {collection.name}</Text>
        </div>
        <div className={styles.body}>
          {selectedFiles.length > 0 && (
            <div className={styles.files}>
              {selectedFiles.map((file, index) => (
                <div key={index} className={styles.fileWrapp}>
                  <img
                    width={30}
                    src={getFilePreview(file)}
                    alt={getFileName(file)}
                    className={styles.filePreview}
                  />
                  <Text size="input" color="primary" className={styles.fileName}>
                    {getFileName(file)}
                  </Text>
                  <Button
                    type="button"
                    variant="ghost"
                    color="black"
                    size="extrasmall"
                    onClick={() => handleRemoveFile(index)}
                    className={styles.removeButton}
                  >
                    <IoClose />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className={styles.content}>
            <FileSelector
              files={selectedFiles}
              maxFiles={50}
              onFilesSelected={setSelectedFiles}
            />
            <Input
              label="Alt text"
              name="altText"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Descripción de la imagen"
            />
            <Button
              type="submit"
              color="primary"
              fullWidth
              disabled={selectedFiles.length === 0}
            >
              {selectedFiles.length === 0
                ? "Selecciona archivos"
                : `Subir ${selectedFiles.length} archivo${selectedFiles.length > 1 ? "s" : ""}`}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
