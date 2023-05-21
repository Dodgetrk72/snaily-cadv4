import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerExpungementRequestsPage } from "./component";

export default async function ExpungementRequestsTabPage() {
  const { data } = await handleServerRequest({ path: "/expungement-requests" });
  return <InnerExpungementRequestsPage expungementRequests={data ?? []} />;
}
