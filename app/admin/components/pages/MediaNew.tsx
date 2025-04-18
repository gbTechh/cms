import { ICollection } from "~/admin/interfaces";
import styles from './medianew.module.css'
import { Input, Spacer, Text } from "../atoms";
import { useEffect, useState } from "react";
import { FileSelector, Tabs, TabsProvider } from "../organisms";

interface Props {
  data: ICollection;
}


export function MediaNew({ data }: Props) {
  const [titleState, setTitleState] = useState<string>("[Untitled]")

  useEffect(() => {
    if(titleState === "") {
      setTitleState("[Untitled]")
    }
  }, [titleState])
  

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
        <div className={styles.content}>
          <FileSelector label="Escoge una imagen" onFilesSelected={() => {}}/>
        </div>
        <div className={styles.box}>
          <Input 
            label="slug"
          />
        </div>
      </div>
      
    </div>
  );
}
