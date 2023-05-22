import { GetIncidentsData } from "@snailycad/types/api";
import { ActiveIncidents } from "~/components/dispatch/active-incidents";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { useDispatchState } from "~/state/dispatch/dispatch-state";

export default async function ActiveIncidentsSegment() {
  const { data } = await handleServerRequest<GetIncidentsData<"leo">>({
    path: "/incidents?activeType=active",
    defaultData: { incidents: [], totalCount: 0 },
  });

  useDispatchState.setState({ activeIncidents: data.incidents });

  // todo: don't render if feature is disabled
  return <ActiveIncidents initialIncidents={data} />;
}
