import { ManageBusinessesTabList } from "./tab-list";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { Permissions } from "@snailycad/permissions";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { AdminNotificationKeys } from "~/components/admin/sidebar/sidebar";

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function ManageBusinessesLayout(props: LayoutProps) {
  const { data } = await handleServerRequest<Record<AdminNotificationKeys, number>>({
    path: "/notifications/admin",
  });

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
      <ManageBusinessesTabList notifications={data}>{props.children}</ManageBusinessesTabList>
    </RequiredPermissions>
  );
}
