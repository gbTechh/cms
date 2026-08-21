import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { LoginPage } from "~/admin/components";
import { login, countUsers, createUser, getSession, assertCsrf } from "~/admin/use_cases";
import { ROUTES } from "~/admin/constants";
import "~/admin/styles/global.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Si ya hay sesión activa, redirigir al admin
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("userId")) throw redirect(ROUTES.ADMIN);

  // Si no hay usuarios, mostrar formulario de setup
  const total = await countUsers();
  return { isSetup: total === 0 };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  await assertCsrf(request, form);
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  const name = form.get("name") as string | null;

  // Setup: crear primer usuario
  if (name) {
    const result = await createUser({ name, email, password });
    if (result?.error?.hasError) return { error: result.error.message as string };
    return login(request, { email, password });
  }

  // Login normal
  const result = await login(request, { email, password });
  // Si login devolvió un error (no es un redirect)
  if (result && "error" in result) {
    return { error: result.error.message as string };
  }
  return result;
};

export default function AdminLogin() {
  const { isSetup } = useLoaderData<typeof loader>();
  const actionData = useActionData<{ error?: string }>();

  return <LoginPage isSetup={isSetup} error={actionData?.error} />;
}
