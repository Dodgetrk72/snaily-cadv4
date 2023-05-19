import { ManageBusinessesTabList } from "./tab-list";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { Permissions } from "@snailycad/permissions";

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function ManageBusinessesLayout(props: LayoutProps) {
  return (
    <RequiredPermissions
      permissions={{
        permissions: [
          Permissions.ViewBusinesses,
          Permissions.DeleteBusinesses,
          Permissions.ManageBusinesses,
        ],
      }}
    >
      <ManageBusinessesTabList>{props.children}</ManageBusinessesTabList>
    </RequiredPermissions>
  );
}
