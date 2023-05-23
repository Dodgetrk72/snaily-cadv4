import { Get911CallsData } from "@snailycad/types/api";
import { ActiveCalls } from "~/components/dispatch/active-calls/active-calls";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";

export default async function ActiveCallsSegment() {
  const { data } = await handleServerRequest<Get911CallsData>({
    path: "/911-calls",
    defaultData: { totalCount: 0, calls: [] },
  });

  // todo: don't render if feature is disabled

  return <ActiveCalls initialData={data} />;
}
