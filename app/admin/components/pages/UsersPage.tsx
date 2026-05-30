import { useFetcher, useRevalidator } from "@remix-run/react";
import { useEffect, useState } from "react";
import { IoClose, IoPersonAddOutline, IoPencilOutline, IoTrashOutline } from "react-icons/io5";
import { Button, Input, Spacer, Text } from "../atoms";
import { IUser, IUserError } from "~/admin/interfaces";
import { TError } from "~/admin/lib";
import styles from "./userspage.module.css";

interface Props {
  users: IUser[];
  currentUserId: string;
}

type ModalMode = "create" | "edit" | null;

interface FetcherData {
  error?: TError<IUserError>;
}

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export function UsersPage({ users, currentUserId }: Props) {
  const fetcher = useFetcher<FetcherData>();
  const { revalidate } = useRevalidator();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);

  const isSaving = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data !== undefined) {
      if (!fetcher.data?.error?.hasError) {
        setModalMode(null);
        setEditingUser(null);
        revalidate();
      }
    }
  }, [fetcher.state]);

  const openCreate = () => {
    setEditingUser(null);
    setModalMode("create");
  };

  const openEdit = (user: IUser) => {
    setEditingUser(user);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingUser(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (id === currentUserId) return;
    if (!confirm(`¿Eliminar al usuario "${name}"? Esta acción no se puede deshacer.`)) return;
    fetcher.submit({ _action: "delete", id }, { method: "post" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (modalMode === "edit" && editingUser) {
      fd.append("_action", "update");
      fd.append("id", editingUser.id);
    } else {
      fd.append("_action", "create");
    }
    fetcher.submit(fd, { method: "post" });
  };

  const serverError = fetcher.data?.error?.message as string | undefined;

  return (
    <div className={styles.root}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Text size="big" color="white">Usuarios</Text>
          <span className={styles.count}>
            {users.length} {users.length === 1 ? "usuario" : "usuarios"}
          </span>
        </div>
        <Button type="button" color="primary" size="small" onClick={openCreate}>
          <IoPersonAddOutline />
          Nuevo usuario
        </Button>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        {users.length === 0 ? (
          <div className={styles.empty}>
            <Text size="sm" color="primary">No hay usuarios registrados.</Text>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Creado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className={styles.nameCell}>
                      <div className={styles.avatar}>{initials(user.name)}</div>
                      <Text size="sm" color="contrast" fw="medium">
                        {user.name}
                        {user.id === currentUserId && (
                          <> <Text as="span" size="xs" color="primary">(tú)</Text></>
                        )}
                      </Text>
                    </div>
                  </td>
                  <td>
                    <span className={styles.mono}>{user.email}</span>
                  </td>
                  <td>
                    <Text size="xs" color="primary">{formatDate(user.createdAt)}</Text>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Button
                        type="button"
                        variant="ghost"
                        color="black"
                        size="extrasmall"
                        onClick={() => openEdit(user)}
                        title="Editar usuario"
                      >
                        <IoPencilOutline />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        color="danger"
                        size="extrasmall"
                        onClick={() => handleDelete(user.id, user.name)}
                        disabled={user.id === currentUserId}
                        title={user.id === currentUserId ? "No puedes eliminarte a ti mismo" : "Eliminar usuario"}
                      >
                        <IoTrashOutline />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal ── */}
      {modalMode && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <Text size="md" color="contrast" fw="semibold">
                {modalMode === "create" ? "Nuevo usuario" : "Editar usuario"}
              </Text>
              <Button type="button" variant="ghost" color="black" size="extrasmall" onClick={closeModal}>
                <IoClose />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <Input
                label="Nombre completo"
                name="name"
                type="text"
                placeholder="Juan Pérez"
                defaultValue={editingUser?.name ?? ""}
                required
                autoFocus
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="usuario@ejemplo.com"
                defaultValue={editingUser?.email ?? ""}
                required
              />
              <Input
                label={modalMode === "edit" ? "Nueva contraseña (dejar vacío para no cambiar)" : "Contraseña"}
                name="password"
                type="password"
                placeholder="••••••••"
                required={modalMode === "create"}
              />

              {serverError && (
                <div className={styles.modalError}>
                  <Text size="sm" color="error">{serverError}</Text>
                </div>
              )}

              <div className={styles.modalFooter}>
                <Button type="button" variant="ghost" color="black" onClick={closeModal} disabled={isSaving}>
                  Cancelar
                </Button>
                <Button type="submit" color="primary" disabled={isSaving}>
                  {isSaving ? "Guardando…" : modalMode === "create" ? "Crear usuario" : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
