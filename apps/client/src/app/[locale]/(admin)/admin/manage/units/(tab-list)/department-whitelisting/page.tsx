import { GetManageUnitsData } from "@snailycad/types/api";
import { InnerManageUnitsDepartmentWhitelistingPageTab } from "./component";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { Permissions } from "@snailycad/permissions";

export default async function ManageUnitsDepartmentWhitelistingPageTab() {
  const { data } = await handleServerRequest<GetManageUnitsData>({
    path: "/admin/manage/units?pendingOnly=true",
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ManageUnits],
      }}
    >
      <InnerManageUnitsDepartmentWhitelistingPageTab
        defaultData={data ?? { pendingCount: 0, totalCount: 0, units: [] }}
      />
    </RequiredPermissions>
  );
}
