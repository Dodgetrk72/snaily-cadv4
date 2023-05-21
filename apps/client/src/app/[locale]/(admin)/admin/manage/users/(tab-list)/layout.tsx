import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { ManageUsersTabList } from "./tab-list";
import { handleServerRequest } from "~/lib/fetch/server";
import { AdminNotificationKeys } from "~/components/admin/sidebar/sidebar";

interface ManageUsersLayoutProps {
  children: React.ReactNode;
}

export default async function ManageUsersLayout(props: ManageUsersLayoutProps) {
  const { data } = await handleServerRequest<Record<AdminNotificationKeys, number>>({
    path: "/notifications/admin",
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
      <ManageUsersTabList notifications={data}>{props.children}</ManageUsersTabList>
    </RequiredPermissions>
  );
}
