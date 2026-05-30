import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "./session.server";
import { ROUTES } from "~/admin/constants";

export const logout = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect(ROUTES.ADMIN_LOGIN, {
    headers: { "Set-Cookie": await destroySession(session) },
  });
};
