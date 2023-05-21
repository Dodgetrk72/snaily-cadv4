import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { ManageUnitsTabList } from "./tab-list";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { GetManageUnitsData } from "@snailycad/types/api";

export type Unit = GetManageUnitsData["units"][number];
interface ManageUnitsLayoutProps {
  children: React.ReactNode;
}

export default async function ManageUnitsLayout(props: ManageUnitsLayoutProps) {
  const { data } = await handleServerRequest<GetManageUnitsData>({
    path: "/admin/manage/units?pendingOnly=true",
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
      <ManageUnitsTabList pendingUnitsCount={data?.pendingCount ?? 0}>
        {props.children}
      </ManageUnitsTabList>
    </RequiredPermissions>
  );
}
