import { LoaderFunctionArgs } from "@remix-run/node";
import { listEntryOptions, requireAuth } from "~/admin/use_cases";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth(request);
  const options = await listEntryOptions(params.slug!);
  return Response.json({ options });
};
