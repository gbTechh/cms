import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { deleteMedia, listMedia } from "~/admin/use_cases/media";
import { MediaPage } from "~/admin/components";

export const loader = async (_: LoaderFunctionArgs) => {
  return listMedia();
};

export const action = async (ctx: ActionFunctionArgs) => {
  return deleteMedia(ctx);
};

export default function MediaAdmin() {
  const { media } = useLoaderData<typeof loader>();
  return <MediaPage media={media} />;
}
