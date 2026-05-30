import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { logout } from "~/admin/use_cases";
import { ROUTES } from "~/admin/constants";

export const loader = async () => redirect(ROUTES.ADMIN);

export const action = async ({ request }: ActionFunctionArgs) => logout(request);
