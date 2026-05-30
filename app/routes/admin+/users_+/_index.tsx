import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { UsersPage } from "~/admin/components";
import { requireAuth, listUsers, createUser, deleteUser, updateUser } from "~/admin/use_cases";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await requireAuth(request);
  const users = await listUsers();
  return { users, currentUserId: currentUser.id };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAuth(request);
  const form = await request.formData();
  const _action = form.get("_action") as string;

  if (_action === "create") {
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const result = await createUser({ name, email, password });
    if (result?.error?.hasError) return { error: result.error };
    return null;
  }

  if (_action === "update") {
    const id = form.get("id") as string;
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = (form.get("password") as string) || undefined;
    const result = await updateUser(id, { name, email, password });
    if (result?.error?.hasError) return { error: result.error };
    return null;
  }

  if (_action === "delete") {
    const id = form.get("id") as string;
    await deleteUser(id);
    return null;
  }

  return null;
};

export default function UsersRoute() {
  const { users, currentUserId } = useLoaderData<typeof loader>();
  return <UsersPage users={users} currentUserId={currentUserId} />;
}
