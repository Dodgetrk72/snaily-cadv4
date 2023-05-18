import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { InnerManageUsersPage } from "./component";
import { handleServerRequest } from "~/lib/fetch/server";

export default async function ManageUsersPage() {
  const { data } = await handleServerRequest({
    path: "/admin/manage/users",
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
      <InnerManageUsersPage defaultData={data ?? { pendingCount: 0, totalCount: 0, users: [] }} />
    </RequiredPermissions>
  );
}
