import { handleServerRequest } from "~/lib/fetch/server";
import { InnerNameChangeRequestsPage } from "./component";

export default async function NameChangeRequestsTabPage() {
  const { data } = await handleServerRequest({ path: "/name-change" });
  return <InnerNameChangeRequestsPage nameChangeRequests={data ?? []} />;
}
