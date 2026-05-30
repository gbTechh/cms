import { Form } from "@remix-run/react";
import { SiPayloadcms } from "react-icons/si";
import { Button, Input, Spacer, Text } from "../atoms";
import styles from "./loginpage.module.css";

interface Props {
  error?: string;
  isSetup?: boolean;
}

export function LoginPage({ error, isSetup = false }: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.head}>
          <div className={styles.logoWrap}>
            <SiPayloadcms />
          </div>
          <Text size="lg" color="contrast" fw="semibold">
            {isSetup ? "Crear cuenta de administrador" : "Iniciar sesión"}
          </Text>
          <Text size="sm" color="primary">
            {isSetup
              ? "No hay usuarios registrados. Crea el primer administrador."
              : "Ingresa tus credenciales para continuar."}
          </Text>
        </div>

        <Form method="post" className={styles.form}>
          {isSetup && (
            <Input
              label="Nombre completo"
              name="name"
              type="text"
              placeholder="Juan Pérez"
              required
              autoFocus
            />
          )}
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="admin@ejemplo.com"
            required
            autoFocus={!isSetup}
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            placeholder="••••••••"
            required
          />

          {error && (
            <div className={styles.error}>
              <Text size="sm" color="error">
                {error}
              </Text>
            </div>
          )}

          <Spacer y={0.25} />
          <Button type="submit" color="primary" fullWidth>
            {isSetup ? "Crear administrador" : "Ingresar"}
          </Button>
        </Form>

        <div className={styles.footer}>
          <Text size="xs" color="primary">
            CMS Admin — {isSetup ? "Primera configuración" : "Panel de administración"}
          </Text>
        </div>
      </div>
    </div>
  );
}
