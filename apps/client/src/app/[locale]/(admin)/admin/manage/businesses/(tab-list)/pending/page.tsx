import { Permissions } from "@snailycad/permissions";
import { GetManageBusinessesData } from "@snailycad/types/api";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerManagePendingBusinessesPage } from "./component";

export default async function ManagePendingBusinessesPage() {
  const { data } = await handleServerRequest<GetManageBusinessesData>({
    path: "/admin/manage/businesses?pendingOnly=true",
    defaultData: { businesses: [], totalCount: 0 },
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ManageBusinesses],
      }}
    >
      <InnerManagePendingBusinessesPage defaultData={data} />
    </RequiredPermissions>
  );
}
