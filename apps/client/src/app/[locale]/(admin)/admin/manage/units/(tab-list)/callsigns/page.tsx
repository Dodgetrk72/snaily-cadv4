import { GetManageUnitsData } from "@snailycad/types/api";
import { InnerManageUnitsCallsignsPageTab } from "./component";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { Permissions } from "@snailycad/permissions";

export default async function ManageUnitsCallsignsPageTab() {
  const { data } = await handleServerRequest<GetManageUnitsData>({
    path: "/admin/manage/units",
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ManageUnitCallsigns],
      }}
    >
      <InnerManageUnitsCallsignsPageTab
        defaultData={data ?? { pendingCount: 0, totalCount: 0, units: [] }}
      />
    </RequiredPermissions>
  );
}
