import { handleServerRequest } from "~/lib/fetch/server";
import { InnerAdminDashboardPage } from "./component";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { defaultPermissions } from "@snailycad/permissions";

export default async function AdminDashboardPage() {
  const { data } = await handleServerRequest({
    path: "/admin",
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [
          ...defaultPermissions.allDefaultAdminPermissions,
          ...defaultPermissions.defaultCourthousePermissions,
        ],
      }}
    >
      <InnerAdminDashboardPage data={data} />
    </RequiredPermissions>
  );
}
