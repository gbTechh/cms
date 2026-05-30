import { ICollection } from "~/admin/interfaces";
import { Button, Spacer, Text } from "../atoms";
import { IActionOption, Table } from "../organisms";
import { ROUTES } from "~/admin/constants";
import { Link, useFetcher, useNavigate } from "@remix-run/react";
import styles from "./collectionslug.module.css";

interface Props {
  data: ICollection;
}

export function CollectionSlug({ data }: Props) {
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const fieldHeaders = (data.fields ?? []).slice(0, 4).map((field) => ({
    key: field.name,
    label: field.label,
  }));

  const headers = [
    { key: "id", label: "ID" },
    ...fieldHeaders,
    { key: "createdAt", label: "Creado" },
  ];

  const tableData = (data.entries ?? []).map((entry) => ({
    id: entry.id,
    ...entry.data,
    createdAt: new Date(entry.createdAt).toLocaleDateString("es-PE"),
  }));

  const actionOptions: IActionOption[] = [
    {
      label: "Editar",
      onClick: (item) => {
        navigate(`${ROUTES.COLLECTIONS}/${data.slug}/${item.id}`);
      },
    },
    {
      label: "Eliminar",
      onClick: (item) => {
        if (confirm("¿Eliminar esta entrada?")) {
          fetcher.submit(
            { id: item.id },
            { method: "post" }
          );
        }
      },
    },
  ];

  return (
    <div>
      <div className={styles.wrapTitle}>
        <Text size="big" color="white">
          {data.name}
        </Text>
        <Link to={`${ROUTES.ADD_COLLECTIONS}/${data.slug}`}>
          <Button color="black" size="extrasmall">
            + Crear nuevo
          </Button>
        </Link>
      </div>
      <Spacer y={2} />
      <Table
        actionOptions={actionOptions}
        data={tableData}
        headers={headers}
      />
    </div>
  );
}
