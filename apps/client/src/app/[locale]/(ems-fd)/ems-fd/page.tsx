import { Permissions } from "@snailycad/permissions";
import {
  Get911CallsData,
  GetEmsFdActiveDeputies,
  GetEmsFdActiveDeputy,
  GetValuesData,
} from "@snailycad/types/api";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleMultiServerRequest } from "~/lib/fetch/server";
import { InnerEmsFdDashboard } from "./component";

type GetEmsFdDashboardDataTuple = [
  GetValuesData,
  Get911CallsData,
  GetEmsFdActiveDeputies,
  GetEmsFdActiveDeputy | null,
];

export async function getEmsFdDashboardData() {
  const [values, active911Calls, activeDeputies, activeDeputy] =
    await handleMultiServerRequest<GetEmsFdDashboardDataTuple>([
      { path: "/admin/values/codes_10", defaultData: [] },
      { path: "/911-calls", defaultData: { calls: [], totalCount: 0 } },
      { path: "/ems-fd/active-deputies", defaultData: [] },
      { path: "/ems-fd/active-deputy", defaultData: null },
    ]);

  return {
    values,
    active911Calls,
    activeDeputies,
    activeDeputy,
  };
}

export default async function EmsFdDashboard() {
  const data = await getEmsFdDashboardData();

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.EmsFd],
      }}
    >
      <InnerEmsFdDashboard data={data} />
    </RequiredPermissions>
  );
}
