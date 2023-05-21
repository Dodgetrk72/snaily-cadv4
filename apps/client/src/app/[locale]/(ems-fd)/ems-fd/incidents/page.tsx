import { Permissions } from "@snailycad/permissions";
import { GetEmsFdActiveDeputy, GetIncidentsData } from "@snailycad/types/api";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleMultiServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerEmsFdIncidentsPage } from "./component";

type GetEmsFdIncidentsDataTuple = [GetIncidentsData<"ems-fd">, GetEmsFdActiveDeputy | null];

export async function getEMsFdIncidentsData() {
  const [incidents, activeDeputy] = await handleMultiServerRequest<GetEmsFdIncidentsDataTuple>([
    { path: "/ems-fd/incidents", defaultData: { incidents: [], totalCount: 0 } },
    { path: "/ems-fd/active-deputy", defaultData: null },
  ]);

  return { incidents, activeDeputy };
}

export default async function EmsFdIncidentsPage() {
  const data = await getEMsFdIncidentsData();

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ViewEmsFdIncidents, Permissions.ManageEmsFdIncidents],
      }}
    >
      <InnerEmsFdIncidentsPage data={data} />
    </RequiredPermissions>
  );
}
