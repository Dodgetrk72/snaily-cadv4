import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { InnerDispatchPage } from "./component";
import { handleMultiServerRequest } from "~/lib/fetch/handle-server-request";
import {
  Get911CallsData,
  GetActiveOfficersData,
  GetBolosData,
  GetDispatchData,
  GetEmsFdActiveDeputies,
  GetValuesData,
} from "@snailycad/types/api";

export type GetDispatchDataTuple = [
  GetValuesData,
  Get911CallsData,
  GetBolosData,
  GetDispatchData,
  GetActiveOfficersData,
  GetEmsFdActiveDeputies,
];

export async function getDispatchData() {
  const [values, calls, bolos, activeDispatcherData, activeOfficers, activeDeputies] =
    await handleMultiServerRequest<GetDispatchDataTuple>([
      { path: "/admin/values/codes_10", defaultData: [] },
      { path: "/911-calls", defaultData: { calls: [], totalCount: 0 } },
      { path: "/bolos", defaultData: { bolos: [], totalCount: 0 } },
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
    bolos,
    activeDispatcherData,
    activeOfficers,
    activeDeputies,
  };
}

export default async function DispatchPage() {
  const dispatchData = await getDispatchData();

  return (
    <main className="mt-5 px-4 md:px-6 pb-5 container max-w-[100rem] mx-auto">
      <RequiredPermissions
        permissions={{
          permissions: [Permissions.Dispatch],
        }}
      >
        <InnerDispatchPage
          activeDeputies={dispatchData.activeDeputies}
          activeDispatchersCount={dispatchData.activeDispatcherData.activeDispatchersCount}
          activeOfficers={dispatchData.activeOfficers}
          bolos={dispatchData.bolos}
          calls={dispatchData.calls}
          userActiveDispatcher={dispatchData.activeDispatcherData.userActiveDispatcher}
          areaOfPlay={dispatchData.activeDispatcherData.areaOfPlay}
        />
      </RequiredPermissions>
    </main>
  );
}
