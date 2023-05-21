import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerManageCustomRolesPage } from "./component";

export default async function ManageCustomRolesPage() {
  const { data } = await handleServerRequest({
    path: "/admin/manage/custom-roles",
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ManageCustomRoles, Permissions.ViewCustomRoles],
      }}
    >
      <InnerManageCustomRolesPage defaultData={data ?? { customRoles: [], totalCount: 0 }} />
    </RequiredPermissions>
  );
}
