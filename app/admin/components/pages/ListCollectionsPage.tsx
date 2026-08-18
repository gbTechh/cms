import { Spacer, Text } from '../atoms';
import { CardListCollection } from '../molecules';
import styles from './listcollectionspage.module.css'
import { ICollection } from "~/admin/interfaces";


interface Props {
  data: ICollection[];
}

export default function ListCollectionsPage({data}: Props) {
  return (
    <div className={styles.container}>
      <div>
        <Text as="h1" size="big" color="white">Colecciones</Text>
        <Spacer y={2}/>
        <div className={styles.grid}>
          {data.map(e => (
            <CardListCollection link={e.slug} title={e.name} type={e.type} key={e.id}/>
          ))}
        </div>
      </div>
      <div>

      </div>

    </div>
  )
}
