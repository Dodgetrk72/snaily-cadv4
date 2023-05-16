import { handleServerRequest } from "~/lib/fetch/server";
import { InnerExpungementRequestsPage } from "./component";

export default async function ExpungementRequestsTabPage() {
  const { data } = await handleServerRequest({ path: "/expungement-requests" });
  return <InnerExpungementRequestsPage expungementRequests={data ?? []} />;
}
