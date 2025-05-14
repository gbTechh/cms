import { ICollection } from "~/admin/interfaces";
import styles from './entrynew.module.css'
import { Input, Spacer, Text } from "../atoms";
import { useEffect, useState } from "react";
import { FieldFactory, Tabs, TabsProvider } from "../organisms";
import { Descendant } from "slate";

interface Props {
  data: ICollection;
}

const defaultRichTextValue: Descendant[] = [
  {
    children: [{ text: '' }],
  },
];

export function EntryNew({ data }: Props) {
  const [titleState, setTitleState] = useState<string>("[Untitled]")
  const { fields } = data
  useEffect(() => {
    if(titleState === "") {
      setTitleState("[Untitled]")
    }
  }, [titleState])
 

  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  console.log({formData})
 
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
          <Spacer y={2}/>
          <div className={styles.tabs}>
            <TabsProvider>
              <Tabs>
                <Tabs.Item text="Contenido">
                  <div className={styles.wrap}>
                    {
                      fields?.map(field => (
                        <FieldFactory
                          key={field.name}
                          field={field}
                          value={formData[field.name] || (field.defaultValue ?? '')}
                          onChange={(value: any) => handleChange(field.name, value)}
                        />
                      ))
                    }
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
