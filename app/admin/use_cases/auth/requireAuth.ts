import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "./session.server";
import { ROUTES } from "~/admin/constants";
import { IUserSession } from "~/admin/interfaces";
import { PrismaUserRepository } from "~/admin/infraestructure";

export const requireAuth = async (request: Request): Promise<IUserSession> => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId") as string | undefined;

  if (!userId) throw redirect(ROUTES.ADMIN_LOGIN);

  const sessionVersion = session.get("sessionVersion") as number | undefined;
  const repo = new PrismaUserRepository();
  const user = await repo.findById(userId);

  // Usuario eliminado, o la sesión quedó obsoleta (ej. tras un cambio de
  // contraseña) porque su sessionVersion ya no coincide con el de la BD.
  if (!user || user.sessionVersion !== sessionVersion) {
    throw redirect(ROUTES.ADMIN_LOGIN, {
      headers: { "Set-Cookie": await destroySession(session) },
    });
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};
