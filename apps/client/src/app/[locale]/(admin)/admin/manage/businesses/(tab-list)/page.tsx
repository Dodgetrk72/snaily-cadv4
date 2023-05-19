import { Permissions } from "@snailycad/permissions";
import { GetManageBusinessesData } from "@snailycad/types/api";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleServerRequest } from "~/lib/fetch/server";
import { InnerManageBusinessesPage } from "./component";

export default async function ManageBusinessesPage() {
  const { data } = await handleServerRequest<GetManageBusinessesData>({
    path: "/admin/manage/businesses",
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
      <InnerManageBusinessesPage defaultData={data ?? { businesses: [], totalCount: 0 }} />
    </RequiredPermissions>
  );
}
