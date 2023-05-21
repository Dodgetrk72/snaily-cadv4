import { Permissions } from "@snailycad/permissions";
import { GetManageBusinessesData } from "@snailycad/types/api";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerManageBusinessesPage } from "./component";

export default async function ManageBusinessesPage() {
  const { data } = await handleServerRequest<GetManageBusinessesData>({
    path: "/admin/manage/businesses",
    defaultData: { businesses: [], totalCount: 0 },
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
      <InnerManageBusinessesPage defaultData={data} />
    </RequiredPermissions>
  );
}
