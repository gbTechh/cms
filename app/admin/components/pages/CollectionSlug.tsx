import { ICollection } from "~/admin/interfaces";
import { Button, Spacer, Text } from "../atoms";
import { IActionOption, Table } from "../organisms";
import { ROUTES } from "~/admin/constants";
import { Link, useFetcher, useNavigate } from "@remix-run/react";
import { slateToPlainText, useCsrfToken } from "~/admin/lib";
import styles from "./collectionslug.module.css";

interface Props {
  data: ICollection;
}

export function CollectionSlug({ data }: Props) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const csrfToken = useCsrfToken();

  const fieldHeaders = (data.fields ?? []).slice(0, 4).map((field) => ({
    key: field.name,
    label: field.label,
  }));

  const headers = [
    { key: "id", label: "ID" },
    ...fieldHeaders,
    { key: "createdAt", label: "Creado" },
  ];

  const richTextFieldNames = new Set(
    (data.fields ?? []).filter((field) => field.type === "richText").map((field) => field.name)
  );

  const tableData = (data.entries ?? []).map((entry) => {
    const row: Record<string, any> = { id: entry.id };
    for (const [key, value] of Object.entries(entry.data ?? {})) {
      row[key] = richTextFieldNames.has(key)
        ? slateToPlainText(value).slice(0, 140)
        : value;
    }
    row.createdAt = new Date(entry.createdAt).toLocaleDateString("es-PE");
    return row;
  });

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
            { id: item.id, csrf: csrfToken },
            { method: "post" }
          );
        }
      },
    },
  ];

  const page = data.entriesPage ?? 1;
  const pageSize = data.entriesPageSize ?? 50;
  const total = data.entriesTotal ?? tableData.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

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
      {totalPages > 1 && (
        <>
          <Spacer y={1} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text size="xs" color="primary">
              {total} entradas · página {page} de {totalPages}
            </Text>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link
                to={`${ROUTES.COLLECTIONS}/${data.slug}?page=${page - 1}`}
                aria-disabled={page <= 1}
                style={page <= 1 ? { pointerEvents: "none", opacity: 0.5 } : undefined}
              >
                <Button type="button" variant="ghost" color="black" size="extrasmall" disabled={page <= 1}>
                  Anterior
                </Button>
              </Link>
              <Link
                to={`${ROUTES.COLLECTIONS}/${data.slug}?page=${page + 1}`}
                aria-disabled={page >= totalPages}
                style={page >= totalPages ? { pointerEvents: "none", opacity: 0.5 } : undefined}
              >
                <Button type="button" variant="ghost" color="black" size="extrasmall" disabled={page >= totalPages}>
                  Siguiente
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
