import { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return null;
};

export default function DashboardAdmin() {
  return <h1>hola</h1>;
}
