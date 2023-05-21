import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { InnerManageUsersPage } from "./component";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";

export default async function ManageUsersPage() {
  const { data } = await handleServerRequest({
    path: "/admin/manage/users",
    defaultData: { pendingCount: 0, totalCount: 0, users: [] },
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [
          Permissions.BanUsers,
          Permissions.ViewUsers,
          Permissions.ManageUsers,
          Permissions.DeleteUsers,
        ],
      }}
    >
      <InnerManageUsersPage defaultData={data} />
    </RequiredPermissions>
  );
}
