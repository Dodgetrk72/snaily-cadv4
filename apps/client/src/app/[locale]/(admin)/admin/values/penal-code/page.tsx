import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerManagePenalCodeGroupsPage } from "./component";
import { GetPenalCodeGroupsData } from "@snailycad/types/api";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { Permissions } from "@snailycad/permissions";

export default async function ManagePenalCodeGroupsPage() {
  const { data: penalCodeGroupsData } = await handleServerRequest<GetPenalCodeGroupsData>({
    path: "/admin/penal-code-group",
    defaultData: { totalCount: 0, groups: [] },
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ManageValuePenalCode],
      }}
    >
      <InnerManagePenalCodeGroupsPage
        groups={penalCodeGroupsData ?? { groups: [], totalCount: 0 }}
      />
    </RequiredPermissions>
  );
}
