import { GetDepartmentTimeLogsDepartmentsData } from "@snailycad/types/api";
import { InnerManageUnitsDepartmentTimeLogsPageTab } from "./component";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { Permissions } from "@snailycad/permissions";

export default async function ManageUnitsDepartmentWhitelistingPageTab() {
  const { data } = await handleServerRequest<GetDepartmentTimeLogsDepartmentsData>({
    path: "/admin/manage/units/department-time-logs/departments",
    defaultData: { logs: [], totalCount: 0 },
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [
          Permissions.ManageUnits,
          Permissions.ViewUnits,
          Permissions.DeleteUnits,
          Permissions.ManageAwardsAndQualifications,
        ],
      }}
    >
      <InnerManageUnitsDepartmentTimeLogsPageTab defaultData={data} />
    </RequiredPermissions>
  );
}
