import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { EntryNew, MediaNew } from "~/admin/components";
import { listCollectionBySlug } from "~/admin/use_cases";

export const loader = async (ctx: LoaderFunctionArgs) => {
  return listCollectionBySlug(ctx);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log({formData})
  const data = JSON.parse(formData.get("data") as string);
  console.log({data})
  return data;
};

export default function CollectionNewAdmin() {
  const { collection } = useLoaderData<typeof loader>();

  const actionData = useActionData();
  console.log({collection})
  return (
    <>
      {
        collection?.isMedia ? (<MediaNew data={collection!} />) : (<EntryNew data={collection!}/>)
      }
    </>
  );
}
