import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerNameChangeRequestsPage } from "./component";

export default async function NameChangeRequestsTabPage() {
  const { data } = await handleServerRequest({ path: "/name-change" });
  return <InnerNameChangeRequestsPage nameChangeRequests={data ?? []} />;
}
