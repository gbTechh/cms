import { ICollection } from "~/admin/interfaces";
import { Button, Spacer, Text } from "../atoms";
import { IActionOption, Table } from "../organisms";
import { ROUTES } from "~/admin/constants";
import { useNavigate } from "@remix-run/react";
import styles from './collectionslug.module.css'

interface Props {
    data: ICollection;
}

const headers = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nombre de colección" },  
  { key: "slug", label: "Slug" },  
];

export function CollectionSlug({data}: Props) {
  const navigate = useNavigate();
  const actionOptions: IActionOption[] = [
    {
      label: "Editar",
      onClick: (id: number) => {
        navigate(`${ROUTES.COLLECTIONS}/${id}`);
      },
    },
    {
      label: "Eliminar",
      onClick: (id) => {
        
      },
    },
  ];


  return (
    <div className="">
        <div className={styles.wrapTitle}>
          <Text size="big" color="white">{data.name}</Text>
          <a>
            <Button color="black" size="small">+ Crear nuevo</Button>
          </a>
        </div>
        <Spacer y={2}/>
        <Table     
          actionOptions={actionOptions}
          data={data.entries}
          headers={headers} />
    </div>
  )
}
