import { ICollection, IMedia } from "~/admin/interfaces";
import { useState, useEffect } from "react";
import { Link, useFetcher, useRevalidator } from "@remix-run/react";
import { ROUTES } from "~/admin/constants";
import styles from "./mediapage.module.css";
import noImage from "../../assets/images/no-image.jpg";
import {
  IoClose,
  IoCopyOutline,
  IoSearch,
  IoTrashOutline,
  IoCheckmark,
  IoCheckboxOutline,
  IoSquareOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { Button, Input, Text, TextArea } from "../atoms";

interface Props {
  collection: ICollection;
  media: IMedia[];
}

const formatBytes = (bytes: number | null): string => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getFilename = (url: string) => url.split("/").pop() ?? url;

const getPreviewSrc = (item: IMedia, fallback: string) =>
  item.mimeType.startsWith("image") ? item.url : fallback;

function MetaRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className={styles.metaRow}>
      <span className={styles.metaLabel}>{label}</span>
      <span className={`${styles.metaValue} ${mono ? styles.metaMono : ""}`}>{value || "—"}</span>
    </div>
  );
}

export function MediaPage({ collection, media }: Props) {
  const fetcher = useFetcher<{ error?: string }>();
  const { revalidate } = useRevalidator();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<IMedia | null>(null);
  const [editAltText, setEditAltText] = useState("");
  const [copied, setCopied] = useState(false);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const isSaving = fetcher.state !== "idle";
  const hasChecked = checkedIds.size > 0;

  // Sync selected item with fresh loader data after revalidation
  useEffect(() => {
    if (!selected) return;
    const fresh = media.find((m) => m.id === selected.id);
    if (fresh) {
      setSelected(fresh);
    } else {
      setSelected(null);
    }
  }, [media]);

  // Revalidate after any successful fetcher action
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data !== undefined) {
      revalidate();
    }
  }, [fetcher.state]);

  // Escape: close panel or clear selection
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (hasChecked) {
        setCheckedIds(new Set());
      } else {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasChecked]);

  // ── Selection helpers ──────────────────────────────────────────────────────

  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    // Close detail panel when entering multi-select mode
    if (!hasChecked) setSelected(null);
  };

  const toggleAll = () => {
    if (checkedIds.size === filtered.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(filtered.map((m) => m.id)));
    }
  };

  const clearSelection = () => setCheckedIds(new Set());

  // ── Card click ─────────────────────────────────────────────────────────────

  const handleCardClick = (item: IMedia) => {
    if (hasChecked) {
      // In selection mode: toggle checkbox
      setCheckedIds((prev) => {
        const next = new Set(prev);
        if (next.has(item.id)) next.delete(item.id);
        else next.add(item.id);
        return next;
      });
    } else {
      setSelected(item);
      setEditAltText(item.altText ?? "");
    }
  };

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleSave = () => {
    if (!selected) return;
    fetcher.submit(
      { _action: "update", id: selected.id, altText: editAltText },
      { method: "post" }
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este archivo? Esta acción no se puede deshacer.")) return;
    if (selected?.id === id) setSelected(null);
    fetcher.submit({ _action: "delete", id }, { method: "post" });
  };

  const handleBulkDelete = () => {
    const count = checkedIds.size;
    if (!confirm(`¿Eliminar ${count} archivo${count > 1 ? "s" : ""}? Esta acción no se puede deshacer.`)) return;
    fetcher.submit(
      { _action: "bulkDelete", ids: JSON.stringify([...checkedIds]) },
      { method: "post" }
    );
    setCheckedIds(new Set());
  };

  const handleCopyUrl = async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(selected.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // ── Filter ─────────────────────────────────────────────────────────────────

  const filtered = media.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      getFilename(m.url).toLowerCase().includes(q) ||
      (m.altText ?? "").toLowerCase().includes(q)
    );
  });

  const allChecked = filtered.length > 0 && checkedIds.size === filtered.length;
  const someChecked = checkedIds.size > 0 && checkedIds.size < filtered.length;
  const altTextDirty = selected ? editAltText !== (selected.altText ?? "") : false;

  return (
    <div className={`${styles.root} ${selected && !hasChecked ? styles.withPanel : ""}`}>

      {/* ── Header ── */}
      <div className={styles.header}>
        {hasChecked ? (
          // ── Bulk action bar ──
          <div className={styles.bulkBar}>
            <div className={styles.bulkBarLeft}>
              <Button
                type="button"
                className={styles.checkAllBtn}
                onClick={toggleAll}
                title={allChecked ? "Deseleccionar todo" : "Seleccionar todo"}
              >
                {allChecked
                  ? <IoCheckboxOutline className={styles.checkAllIcon} />
                  : someChecked
                  ? <IoCheckboxOutline className={`${styles.checkAllIcon} ${styles.checkAllIndeterminate}`} />
                  : <IoSquareOutline className={styles.checkAllIcon} />
                }
              </Button>
              <Text >
                {checkedIds.size} {checkedIds.size === 1 ? "archivo seleccionado" : "archivos seleccionados"}
              </Text>
            </div>
            <div className={styles.bulkBarRight}>
              <Button
                type="button"
                variant="ghost"
                color="black"
                onClick={clearSelection}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                color="danger"
                onClick={handleBulkDelete}
                disabled={isSaving}
              >
                <IoTrashOutline className={styles.trashIcon} />
                Eliminar {checkedIds.size} {checkedIds.size === 1 ? "archivo" : "archivos"}
              </Button>
            </div>
          </div>
        ) : (
          // ── Normal header ──
          <>
            <div className={styles.headerLeft}>
              <Text size="big" color="white">{collection.name}</Text>
              <span className={styles.count}>
                {filtered.length} {filtered.length === 1 ? "archivo" : "archivos"}
              </span>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.searchBar}>
                <div className={styles.search}>
                  <IoSearchOutline className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o alt text…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Buscar archivos"
                    className={styles.searchInput}
                  />
                </div>
               
                {search && (
                  <Button
                    type="button"
                    variant="ghost"
                    color="black"
                    className={styles.searchClear}
                    onClick={() => setSearch("")}
                    aria-label="Limpiar búsqueda"
                  >
                    <IoClose />
                  </Button>
                )}
              </div>
              <Link to={`${ROUTES.ADD_COLLECTIONS}/${collection.slug}`} prefetch="intent">
                <Button type="button" color="primary" size="small">
                  + Subir archivos
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        <div className={styles.gridWrap}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <Text size="14" color="primary">
                {search
                  ? `Sin resultados para "${search}"`
                  : 'No hay archivos subidos aún. Haz click en "+ Subir archivos" para comenzar.'}
              </Text>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((item) => {
                const filename = getFilename(item.url);
                const isSelected = selected?.id === item.id && !hasChecked;
                const isChecked = checkedIds.has(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.card} ${isSelected ? styles.cardActive : ""} ${isChecked ? styles.cardChecked : ""}`}
                    onClick={() => handleCardClick(item)}
                    title={filename}
                  >
                    {/* Checkbox */}
                    <div
                      className={`${styles.cardCheckbox} ${isChecked || hasChecked ? styles.cardCheckboxVisible : ""}`}
                      onClick={(e) => toggleCheck(item.id, e)}
                      role="checkbox"
                      aria-checked={isChecked}
                      aria-label={`Seleccionar ${filename}`}
                    >
                      {isChecked
                        ? <IoCheckmark className={styles.checkIcon} />
                        : <span className={styles.checkEmpty} />
                      }
                    </div>

                    <div className={styles.cardThumb}>
                      <img
                        src={getPreviewSrc(item, noImage)}
                        alt={item.altText ?? filename}
                        className={styles.cardImg}
                        loading="lazy"
                      />
                      {!hasChecked && (
                        <div className={styles.cardOverlay}>
                          <span className={styles.cardOverlayText}>{filename}</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.cardFooter}>
                      <span className={styles.cardName}>{filename}</span>
                      <span className={styles.cardType}>
                        {item.mimeType.split("/")[1]?.toUpperCase()} · {formatBytes(item.fileSize)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail panel (only when not in bulk mode) */}
        {selected && !hasChecked && (
          <aside className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>Detalle del archivo</span>
              <Button
                type="button"
                variant="ghost"
                color="black"
                className={styles.panelCloseBtn}
                onClick={() => setSelected(null)}
                aria-label="Cerrar panel"
              >
                <IoClose />
              </Button>
            </div>

            <div className={styles.panelPreview}>
              <img
                src={getPreviewSrc(selected, noImage)}
                alt={selected.altText ?? getFilename(selected.url)}
                className={styles.panelImg}
              />
            </div>

            <div className={styles.panelContent}>
              <div className={styles.fieldGroup}>
                <TextArea
                  label="Alt text"
                  name="altText"
                  value={editAltText}
                  onChange={(e) => setEditAltText(e.target.value)}
                  rows={3}
                  placeholder="Descripción para accesibilidad y SEO"
                  maxLength={500}
                />
              </div>

              <div className={styles.fieldGroup}>
                <Text as="label" size="xs" color="primary" fw="semibold">URL pública</Text>
                <div className={styles.urlRow}>
                  <span className={styles.urlText}>{selected.url}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    color="black"
                    className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ""}`}
                    onClick={handleCopyUrl}
                    title="Copiar URL"
                  >
                    {copied ? <IoCheckmark /> : <IoCopyOutline />}
                  </Button>
                </div>
              </div>

              <div className={styles.metaBlock}>
                <MetaRow label="Archivo" value={getFilename(selected.url)} mono />
                <MetaRow label="Tipo" value={selected.mimeType} />
                <MetaRow label="Tamaño" value={formatBytes(selected.fileSize)} />
                {selected.width && selected.height && (
                  <MetaRow label="Dimensiones" value={`${selected.width} × ${selected.height} px`} />
                )}
                <MetaRow label="Subido" value={formatDate(selected.createdAt)} />
              </div>
            </div>

            <div className={styles.panelActions}>
              <Button
                type="button"
                color="danger"
                variant="bordered"
                size="small"
                onClick={() => handleDelete(selected.id)}
                disabled={isSaving}
              >
                <IoTrashOutline />
                Eliminar
              </Button>
              <div className={styles.panelActionsRight}>
                <Button
                  type="button"
                  variant="ghost"
                  color="black"
                  size="small"
                  onClick={() => setEditAltText(selected.altText ?? "")}
                  disabled={isSaving || !altTextDirty}
                >
                  Descartar
                </Button>
                <Button
                  type="button"
                  color="primary"
                  size="small"
                  onClick={handleSave}
                  disabled={isSaving || !altTextDirty}
                >
                  {isSaving ? "Guardando…" : "Guardar"}
                </Button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
