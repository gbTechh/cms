import { redirect } from "@remix-run/node"
import { ROUTES } from "../../constants"

export const loader = () => {
  return redirect(ROUTES.DASHBOARD)
}