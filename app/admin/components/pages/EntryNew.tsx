import { ICollection } from "~/admin/interfaces";
import styles from './entrynew.module.css'
import { Input, Spacer, Text } from "../atoms";
import { useEffect, useState } from "react";
import { Tabs, TabsProvider } from "../organisms";

interface Props {
  data: ICollection;
}


export function EntryNew({ data }: Props) {
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
        <Text size="14" color="primary">{`Creando un nuevo ${data.name}`}</Text>
      </div>
      <div className={styles.body}>
        <div className={styles.content}>
          <div className={styles.title}>
            <Input 
                label="título"
                onChange={(ev) => {setTitleState(ev.target.value)}}
              />
          </div>
          <div className={styles.tabs}>
            <TabsProvider>
              <Tabs>
                <Tabs.Item text="Contenido">
                  <div className={styles.wrap}>
                    <Text>asdsad</Text>
                  </div>
                </Tabs.Item>
                <Tabs.Item text="Meta">
                  <div>

                  </div>
                </Tabs.Item>             
                <Tabs.Item text="SEO">
                  <div>

                  </div>
                </Tabs.Item>             
              </Tabs>
              <Tabs.Body />
            </TabsProvider>
          </div>
          
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
