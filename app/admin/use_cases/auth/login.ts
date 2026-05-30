import { redirect } from "@remix-run/node";
import { IUserLogin } from "~/admin/interfaces";
import { PrismaUserRepository } from "~/admin/infraestructure";
import { AuthService } from "./service";
import { commitSession, getSession } from "./session.server";
import { ROUTES } from "~/admin/constants";

export const login = async (request: Request, data: IUserLogin) => {
  const service = new AuthService(new PrismaUserRepository());
  const result = await service.login(data.email, data.password);

  if (result.error) return { error: result.error };

  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", result.user!.id);
  session.set("userName", result.user!.name);
  session.set("userEmail", result.user!.email);

  return redirect(ROUTES.ADMIN, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};
