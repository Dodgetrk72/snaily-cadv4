import { InnerDispatchPage } from "./component";
import { handleMultiServerRequest } from "~/lib/fetch/handle-server-request";
import {
  Get911CallsData,
  GetActiveOfficersData,
  GetDispatchData,
  GetEmsFdActiveDeputies,
  GetValuesData,
} from "@snailycad/types/api";

export type GetDispatchDataTuple = [
  GetValuesData,
  Get911CallsData,
  GetDispatchData,
  GetActiveOfficersData,
  GetEmsFdActiveDeputies,
];

export async function getDispatchData() {
  const [values, calls, activeDispatcherData, activeOfficers, activeDeputies] =
    await handleMultiServerRequest<GetDispatchDataTuple>([
      { path: "/admin/values/codes_10", defaultData: [] },
      { path: "/911-calls", defaultData: { calls: [], totalCount: 0 } },
      {
        path: "/dispatch",
        defaultData: { areaOfPlay: null, activeDispatchersCount: 0, userActiveDispatcher: null },
      },
      { path: "/leo/active-officers", defaultData: [] },
      { path: "/ems-fd/active-deputies", defaultData: [] },
    ]);

  return {
    values,
    calls,
    activeDispatcherData,
    activeOfficers,
    activeDeputies,
  };
}

export default async function DispatchPage() {
  const dispatchData = await getDispatchData();

  return (
    <InnerDispatchPage
      activeDeputies={dispatchData.activeDeputies}
      activeDispatchersCount={dispatchData.activeDispatcherData.activeDispatchersCount}
      activeOfficers={dispatchData.activeOfficers}
      calls={dispatchData.calls}
      userActiveDispatcher={dispatchData.activeDispatcherData.userActiveDispatcher}
      areaOfPlay={dispatchData.activeDispatcherData.areaOfPlay}
    />
  );
}
