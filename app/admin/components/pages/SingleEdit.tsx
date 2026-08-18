import { ICollection } from "~/admin/interfaces";
import styles from "./entrynew.module.css";
import { Button, Input, Spacer, Text } from "../atoms";
import { FieldFactory } from "../organisms";
import { Form, useActionData } from "@remix-run/react";
import { useForm } from "~/hooks";
import { CsrfInput } from "~/admin/lib";

interface Props {
  data: ICollection;
}

/**
 * Editor para colecciones "single" (type: "global" | "page"): un único
 * registro de datos (DataSingle) en vez de una lista de entries. Reutiliza
 * el mismo FieldFactory que EntryNew para renderizar los campos definidos
 * en la colección.
 */
export function SingleEdit({ data }: Props) {
  const actionData = useActionData<{
    error?: { message: string; body?: { data?: string; slug?: string } };
  }>();

  const initialData = data.dataSingle?.data ?? {};
  const { formData, onChange } = useForm<Record<string, any>>(initialData);
  const { fields } = data;

  return (
    <Form method="post">
      <CsrfInput />
      <input type="hidden" name="collectionId" value={data.id} />
      <input type="hidden" name="data" value={JSON.stringify(formData)} />

      <div className={styles.container}>
        <div className={`${styles.wrapTitle} paddingWrap`}>
          <Text size="big" color="white">
            {data.name}
          </Text>
          <Spacer y={0.2} />
          <Text size="14" color="primary">
            Editando el contenido único de {data.name}
          </Text>
          {actionData?.error?.body?.data && (
            <>
              <Spacer y={0.5} />
              <Text size="sm" color="error">
                {actionData.error.body.data}
              </Text>
            </>
          )}
        </div>

        <div className={styles.body}>
          <div className={styles.content}>
            <div className={styles.tabs}>
              <div className={`${styles.wrap} paddingWrapTab`}>
                {fields?.map((field) => (
                  <FieldFactory
                    key={field.name}
                    name={field.name}
                    field={field}
                    value={formData[field.name] ?? field.defaultValue ?? ""}
                    onChange={onChange}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.box}>
            <Button type="submit" color="primary" fullWidth>
              Guardar cambios
            </Button>
            <Spacer y={2} />
            <div className={styles.slugField}>
              <Text size="sm" color="primary">
                Slug (frontend)
              </Text>
              <Input
                name="slug"
                defaultValue={data.dataSingle?.slug ?? data.slug}
                placeholder={data.slug}
                error={actionData?.error?.body?.slug}
              />
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
