import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { ManageUsersTabList } from "./tab-list";

interface ManageUsersLayoutProps {
  children: React.ReactNode;
}

export default function ManageUsersLayout(props: ManageUsersLayoutProps) {
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
      <ManageUsersTabList>{props.children}</ManageUsersTabList>
    </RequiredPermissions>
  );
}
