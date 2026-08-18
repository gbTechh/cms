import { ICollection, IFormSubmission } from "~/admin/interfaces";
import { Button, Spacer, Text } from "../atoms";
import { IActionOption, Table } from "../organisms";
import { ROUTES } from "~/admin/constants";
import { Link, useFetcher } from "@remix-run/react";
import { useCsrfToken } from "~/admin/lib";
import styles from "./collectionslug.module.css";

interface Props {
  collection: ICollection;
  submissions: IFormSubmission[];
  total?: number;
  page?: number;
  pageSize?: number;
}

/**
 * Lista los envíos (FormSubmission) recibidos por una colección type "form".
 * A diferencia de CollectionSlug, no hay "Crear nuevo" ni "Editar": los
 * registros solo llegan por POST público a /forms/:slug.
 */
export function FormSubmissionsPage({ collection, submissions, total, page = 1, pageSize = 50 }: Props) {
  const fetcher = useFetcher();
  const csrfToken = useCsrfToken();

  const fieldHeaders = (collection.fields ?? []).slice(0, 5).map((field) => ({
    key: field.name,
    label: field.label,
  }));

  const headers = [...fieldHeaders, { key: "createdAt", label: "Recibido" }];

  const tableData = submissions.map((submission) => {
    const row: Record<string, any> = { id: submission.id };
    for (const [key, value] of Object.entries(submission.data ?? {})) {
      row[key] = value;
    }
    row.createdAt = new Date(submission.createdAt).toLocaleString("es-PE");
    return row;
  });

  const actionOptions: IActionOption[] = [
    {
      label: "Eliminar",
      onClick: (item) => {
        if (confirm("¿Eliminar este envío?")) {
          fetcher.submit({ id: item.id, csrf: csrfToken }, { method: "post" });
        }
      },
    },
  ];

  const totalCount = total ?? tableData.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div>
      <div className={styles.wrapTitle}>
        <Text size="big" color="white">
          {collection.name}
        </Text>
      </div>
      <Spacer y={0.5} />
      <Text size="14" color="primary">
        Los envíos llegan desde el sitio público vía POST a /forms/{collection.slug}
      </Text>
      <Spacer y={2} />
      {tableData.length === 0 ? (
        <Text size="14" color="primary">
          Todavía no hay envíos para este formulario.
        </Text>
      ) : (
        <Table actionOptions={actionOptions} data={tableData} headers={headers} />
      )}
      {totalPages > 1 && (
        <>
          <Spacer y={1} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Text size="xs" color="primary">
              {totalCount} envíos · página {page} de {totalPages}
            </Text>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link
                to={`${ROUTES.COLLECTIONS}/${collection.slug}?page=${page - 1}`}
                aria-disabled={page <= 1}
                style={page <= 1 ? { pointerEvents: "none", opacity: 0.5 } : undefined}
              >
                <Button type="button" variant="ghost" color="black" size="extrasmall" disabled={page <= 1}>
                  Anterior
                </Button>
              </Link>
              <Link
                to={`${ROUTES.COLLECTIONS}/${collection.slug}?page=${page + 1}`}
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
