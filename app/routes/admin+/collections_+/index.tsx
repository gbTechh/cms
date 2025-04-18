import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ListCollectionsPage from "~/admin/components/pages/ListCollectionsPage";
import { listCollections } from "~/admin/use_cases";

export const loader = async ({request}: LoaderFunctionArgs) => {
  return listCollections(request);
};

export default function Collections() {
  const { collections } = useLoaderData<typeof loader>();
  return <ListCollectionsPage data={collections!} />;
}
