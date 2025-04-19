import { ICollection } from "~/admin/interfaces";
import styles from './medianew.module.css'
import { Input, Spacer, Text } from "../atoms";
import { useEffect, useState } from "react";
import { FileSelector } from "../organisms";
import video from "../../assets/images/video.png";
import noImage from "../../assets/images/no-image.jpg";
import pdf from "../../assets/images/pdf.png";
import { IoClose } from "react-icons/io5";

interface Props {
  data: ICollection;
}


export function MediaNew({ data }: Props) {
  const [titleState, setTitleState] = useState<string>("Media")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  console.log('selectedFiles:', {selectedFiles});
  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    // Aquí puedes hacer lo que necesites con los archivos seleccionados
    console.log("Archivos seleccionados en MediaNew:", files);
  };

  useEffect(() => {
    if(titleState === "") {
      setTitleState("[Untitled]")
    }
  }, [titleState])
  
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

  const getFileName = (file: string | File) => {
    if (typeof file === "string") {
      const str = file.split("/");
      return str[str.length - 1];
    }
    return file.name;
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, i) => i !== index);
      handleFilesSelected(newFiles as File[]);
      return newFiles;
    });
  };

  console.log({selectedFiles})
  return (
    <div className={styles.container}>
     <div className={styles.wrapTitle}>
        <Text size="big" color="white">
          {titleState}
        </Text>
        <Spacer y={0.2}/>
        <Text size="14" color="primary">{`Creando un/a nuevo ${data.name}`}</Text>
      </div>
      <div className={styles.body}>
        {selectedFiles.length > 1 ? (
          <div className={styles.files}>
            {selectedFiles.map((file, index) => (
              <div className={styles.fileWrapp}>
                <img
                  width={30}
                  src={getFilePreview(file)}
                  alt={getFileName(file)}
                  className={styles.filePreview}
                />
                <Text size="input" color="primary" className={styles.fileName}>
                  {getFileName(file)}
                </Text>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className={styles.removeButton}
                >
                  <IoClose />
                </button>
              </div>
            ))}
          </div>
        ) : (<></>)}        
        <div className={styles.content}>
          <FileSelector maxFiles={50} onFilesSelected={handleFilesSelected}/>  
          <div>
            
          </div>
          <Input 
            label="Alt"
          />        
        </div>
       
        
        
      </div>
      
    </div>
  );
}
