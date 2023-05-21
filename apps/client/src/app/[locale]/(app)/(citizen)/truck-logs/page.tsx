import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerTruckLogsPage } from "./component";
import { GetTruckLogsData } from "@snailycad/types/api";

export default async function TruckLogsPage() {
  const truckLogs = await handleServerRequest<GetTruckLogsData>({
    path: "/truck-logs",
    defaultData: { logs: [], totalCount: 0 },
  });

  return <InnerTruckLogsPage initialData={truckLogs.data} />;
}
