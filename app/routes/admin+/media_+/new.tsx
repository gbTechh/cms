import { ActionFunctionArgs } from "@remix-run/node";
import { uploadMedia } from "~/admin/use_cases/media";
import { MediaNew } from "~/admin/components";

export const action = async (ctx: ActionFunctionArgs) => {
  return uploadMedia(ctx);
};

export default function MediaNewAdmin() {
  return <MediaNew />;
}
