import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { InnerManageUnitsPage } from "./component";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { GetManageUnitsData } from "@snailycad/types/api";

export default async function ManageUnitsPage() {
  const { data } = await handleServerRequest<GetManageUnitsData>({
    path: "/admin/manage/units",
    defaultData: { pendingCount: 0, totalCount: 0, units: [] },
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [
          Permissions.ViewUnits,
          Permissions.DeleteUnits,
          Permissions.ManageUnits,
          Permissions.ManageUnitCallsigns,
          Permissions.ManageAwardsAndQualifications,
        ],
      }}
    >
      <InnerManageUnitsPage defaultData={data} />
    </RequiredPermissions>
  );
}
