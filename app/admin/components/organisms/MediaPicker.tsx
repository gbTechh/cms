import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useFetcher } from "@remix-run/react";
import { IMedia } from "~/admin/interfaces";
import { Text, Button } from "../atoms";
import { IoClose, IoImageOutline, IoSearchOutline } from "react-icons/io5";
import styles from "./mediapicker.module.css";

type OnChangeInput = { name: string; value: any };

interface Props {
  label?: string;
  name: string;
  value?: string;
  required?: boolean;
  allowedTypes?: string[];
  onChange: (value: OnChangeInput) => void;
}

const getFilename = (url: string) => url.split("/").pop() ?? url;

// Reemplaza al viejo <input type="file"> (comentado en FieldFactory) para
// campos "upload": en vez de tipear la URL a mano, elige un archivo ya
// subido a Media. Guarda `media.url` (string) en el campo — mismo formato
// de dato que antes, cero cambios en cómo el frontend público lo consume.
export const MediaPicker: React.FC<Props> = ({ label, name, value = "", required, allowedTypes, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const fetcher = useFetcher<{ media: IMedia[] }>();

  useEffect(() => {
    // Recarga cada vez que se abre (no solo la primera vez): si el usuario
    // subió un archivo nuevo desde "Subir un archivo nuevo →" en otra
    // pestaña, al reabrir el picker lo ve sin recargar toda la página.
    if (open && fetcher.state === "idle") {
      fetcher.load("/admin/media-options");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const allMedia = fetcher.data?.media ?? [];
  const matchesType = (m: IMedia) =>
    !allowedTypes?.length || allowedTypes.some((t) => (t.endsWith("/*") ? m.mimeType.startsWith(t.slice(0, -1)) : m.mimeType === t));
  const q = search.trim().toLowerCase();
  const filtered = allMedia.filter(
    (m) => matchesType(m) && (!q || getFilename(m.url).toLowerCase().includes(q) || (m.altText ?? "").toLowerCase().includes(q))
  );

  const handleSelect = (media: IMedia) => {
    onChange({ name, value: media.url });
    setOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ name, value: "" });
  };

  return (
    <div className={styles.wrap}>
      {label && (
        <Text as="label" size="sm" color="primary">
          {label}
          {required && <span className={styles.required}> *</span>}
        </Text>
      )}

      <button type="button" className={styles.trigger} onClick={() => setOpen(true)}>
        {value ? (
          <>
            <span className={styles.previewThumb}>
              <img src={value} alt="" className={styles.previewImg} />
            </span>
            <span className={styles.previewName}>{getFilename(value)}</span>
            <span className={styles.clearBtn} onClick={handleClear} role="button" aria-label="Quitar imagen">
              <IoClose />
            </span>
          </>
        ) : (
          <>
            <IoImageOutline className={styles.emptyIcon} />
            <span className={styles.emptyText}>Elegir imagen de Media…</span>
          </>
        )}
      </button>

      {open &&
        createPortal(
          <div className={styles.overlay} onClick={() => setOpen(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHead}>
                <Text size="md" color="primary" fw="semibold">Elegir imagen</Text>
                <button type="button" className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Cerrar">
                  <IoClose />
                </button>
              </div>

              <div className={styles.searchRow}>
                <IoSearchOutline className={styles.searchIcon} />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Buscar por nombre o alt text…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>

              <div className={styles.grid}>
                {fetcher.state !== "idle" && !fetcher.data ? (
                  <Text size="sm" color="primary">Cargando…</Text>
                ) : filtered.length === 0 ? (
                  <Text size="sm" color="primary">
                    {allMedia.length === 0 ? "No hay archivos en Media todavía." : "Sin resultados."}
                  </Text>
                ) : (
                  filtered.map((m) => (
                    <button key={m.id} type="button" className={styles.card} onClick={() => handleSelect(m)} title={getFilename(m.url)}>
                      {m.mimeType.startsWith("image") ? (
                        <img src={m.url} alt={m.altText ?? ""} className={styles.cardImg} loading="lazy" />
                      ) : (
                        <span className={styles.cardFileType}>{m.mimeType.split("/")[1]?.toUpperCase()}</span>
                      )}
                      <span className={styles.cardName}>{getFilename(m.url)}</span>
                    </button>
                  ))
                )}
              </div>

              <div className={styles.modalFoot}>
                <Button type="button" variant="ghost" color="black" size="small" onClick={() => window.open("/admin/collections/media", "_blank")}>
                  Subir un archivo nuevo →
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
