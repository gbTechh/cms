import { ICollection, IEntry } from "~/admin/interfaces";
import styles from "./entrynew.module.css";
import { Button, Input, Spacer, Text } from "../atoms";
import { useEffect, useState } from "react";
import { FieldFactory, Tabs, TabsProvider } from "../organisms";
import { Form, useActionData } from "@remix-run/react";
import { useForm } from "~/hooks";

interface Props {
  data: ICollection;
  entry?: IEntry;
}

const toSlug = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export function EntryNew({ data, entry }: Props) {
  const actionData = useActionData<{ error?: { message: string; body?: { entry_slug?: string } } }>();
  const isEditing = !!entry;
  const initialData = entry?.data ?? {};

  const { formData, onChange } = useForm<Record<string, any>>(initialData);
  const { fields } = data;

  // Slug is locked (manual) when editing an entry that already has a slug,
  // or when the user has manually edited it.
  const [slugLocked, setSlugLocked] = useState(
    isEditing && !!entry?.data?.entry_slug
  );

  const titleValue = formData["entry_name"] ?? "";
  const displayTitle = titleValue || "[Untitled]";

  // Auto-generate slug from title when not locked
  useEffect(() => {
    if (!slugLocked && titleValue) {
      onChange({ name: "entry_slug", value: toSlug(titleValue) });
    }
  }, [titleValue, slugLocked]);

  const handleSlugChange = (ev: any) => {
    setSlugLocked(true);
    onChange(ev);
  };

  const handleToggleLock = () => {
    const next = !slugLocked;
    setSlugLocked(next);
    if (!next && titleValue) {
      onChange({ name: "entry_slug", value: toSlug(titleValue) });
    }
  };

  return (
    <Form method="post">
      {isEditing && <input type="hidden" name="entryId" value={entry!.id} />}
      <input type="hidden" name="collectionId" value={data.id} />
      <input type="hidden" name="data" value={JSON.stringify(formData)} />

      <div className={styles.container}>
        <div className={`${styles.wrapTitle} paddingWrap`}>
          <Text size="big" color="white">
            {displayTitle}
          </Text>
          <Spacer y={0.2} />
          <Text size="14" color="primary">
            {isEditing ? `Editando entrada de ${data.name}` : `Creando un nuevo ${data.name}`}
          </Text>
        </div>

        <div className={styles.body}>
          <div className={styles.content}>
            <div className={`${styles.title} paddingWrapBody`}>
              <Input
                label="Título"
                name="entry_name"
                value={formData["entry_name"] ?? ""}
                onChange={onChange}
              />
            </div>
            <Spacer y={2} />
            <div className={styles.tabs}>
              <TabsProvider>
                <Tabs>
                  <Tabs.Item text="Contenido">
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
                  </Tabs.Item>
                  <Tabs.Item text="Meta">
                    <div className={`${styles.wrap} paddingWrapTab`}>
                      <Input
                        label="Autor"
                        name="meta_author"
                        value={formData["meta_author"] ?? ""}
                        onChange={onChange}
                      />
                      <Spacer y={1} />
                      <Input
                        label="Fecha de publicación"
                        name="meta_published_at"
                        value={formData["meta_published_at"] ?? ""}
                        onChange={onChange}
                      />
                      <Spacer y={1} />
                      <Input
                        label="Estado"
                        name="meta_status"
                        value={formData["meta_status"] ?? "draft"}
                        onChange={onChange}
                      />
                    </div>
                  </Tabs.Item>
                  <Tabs.Item text="SEO">
                    <div className={`${styles.wrap} paddingWrapTab`}>
                      <Input
                        label="Meta título"
                        name="seo_title"
                        value={formData["seo_title"] ?? ""}
                        onChange={onChange}
                      />
                      <Spacer y={1} />
                      <Input
                        label="Meta descripción"
                        name="seo_description"
                        value={formData["seo_description"] ?? ""}
                        onChange={onChange}
                      />
                      <Spacer y={1} />
                      <Input
                        label="URL canónica"
                        name="seo_canonical"
                        value={formData["seo_canonical"] ?? ""}
                        onChange={onChange}
                      />
                      <Spacer y={1} />
                      <Input
                        label="OG Image URL"
                        name="seo_og_image"
                        value={formData["seo_og_image"] ?? ""}
                        onChange={onChange}
                      />
                    </div>
                  </Tabs.Item>
                </Tabs>
                <Tabs.Body />
              </TabsProvider>
            </div>
          </div>

          <div className={styles.box}>
            <Button type="submit" color="primary" fullWidth>
              {isEditing ? "Guardar cambios" : "Crear entrada"}
            </Button>
            <Spacer y={2} />
            <div className={styles.slugField}>
              <div className={styles.slugLabel}>
                <Text size="sm" color="primary">Slug</Text>
                <Button
                  type="button"
                  variant="ghost"
                  color="black"
                  size="extrasmall"
                  onClick={handleToggleLock}
                  className={styles.slugToggle}
                >
                  {slugLocked ? "Manual" : "Auto"}
                </Button>
              </div>
              <Input
                name="entry_slug"
                value={formData["entry_slug"] ?? ""}
                onChange={handleSlugChange}
                placeholder="mi-entrada"
                error={actionData?.error?.body?.entry_slug}
              />
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
