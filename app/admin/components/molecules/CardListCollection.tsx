
import { CiCirclePlus } from 'react-icons/ci';
import { Box, Text } from '../atoms';
import styles from './cardlistcollection.module.css'
import { Link } from '@remix-run/react';

interface Props {
  title: string;
  link:  string;
  type?: "collection" | "global" | "page" | "form";
}

const badgeLabel: Record<string, string> = {
  global: "Single",
  page: "Single",
  form: "Form",
};

export const CardListCollection = ({title, link, type = "collection"}: Props) => {
  const badge = badgeLabel[type];
  return (
    <Box className={styles.card}>
      <div className={styles.info}>
        <Text className={styles.title}>{title}</Text>
        {badge && <Text className={styles.badge}>{badge}</Text>}
      </div>
      <Link to={link} >
        <CiCirclePlus className={styles.icon} />
      </Link>
    </Box>
  )
}
