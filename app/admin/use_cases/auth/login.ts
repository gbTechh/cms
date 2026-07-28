import { redirect } from "@remix-run/node";
import { IUserLogin } from "~/admin/interfaces";
import { PrismaUserRepository } from "~/admin/infraestructure";
import { AuthService } from "./service";
import { commitSession, getSession } from "./session.server";
import { ROUTES } from "~/admin/constants";
import {
  checkLoginRateLimit,
  clearLoginAttempts,
  getClientIp,
  recordFailedLogin,
} from "./rateLimiter.server";

export const login = async (request: Request, data: IUserLogin) => {
  const ip = getClientIp(request);

  const rateLimit = checkLoginRateLimit(ip, data.email);
  if (!rateLimit.allowed) {
    const minutes = Math.ceil((rateLimit.retryAfterMs ?? 0) / 60_000);
    return {
      error: {
        hasError: true,
        message: `Demasiados intentos fallidos. Intenta de nuevo en ${minutes} minuto(s).`,
        body: undefined,
      },
    };
  }

  const service = new AuthService(new PrismaUserRepository());
  const result = await service.login(data.email, data.password);

  if (result.error) {
    recordFailedLogin(ip, data.email);
    return { error: result.error };
  }

  clearLoginAttempts(ip, data.email);

  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", result.user!.id);
  session.set("userName", result.user!.name);
  session.set("userEmail", result.user!.email);
  session.set("sessionVersion", result.user!.sessionVersion);

  return redirect(ROUTES.ADMIN, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};
