import { redirect } from "@remix-run/node";
import { getSession } from "./session.server";
import { ROUTES } from "~/admin/constants";
import { IUserSession } from "~/admin/interfaces";

export const requireAuth = async (request: Request): Promise<IUserSession> => {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId") as string | undefined;

  if (!userId) throw redirect(ROUTES.ADMIN_LOGIN);

  return {
    id: userId,
    name: session.get("userName") as string,
    email: session.get("userEmail") as string,
  };
};
