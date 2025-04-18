
import { CiCirclePlus } from 'react-icons/ci';
import { Box, Text } from '../atoms';
import styles from './cardlistcollection.module.css'
import { Link } from '@remix-run/react';

interface Props {
  title: string;
  link:  string;
}

export const CardListCollection = ({title, link}: Props) => {
  return (
    <Box className={styles.card}>
      <Text className={styles.title}>{title}</Text>
      <Link to={link} >
        <CiCirclePlus className={styles.icon} />
      </Link>
    </Box>
  )
}
