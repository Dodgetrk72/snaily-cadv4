import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerImportVehiclesPage } from "./component";
import { GetImportVehiclesData } from "@snailycad/types/api";

export default async function ImportVehiclesPage() {
  const { data } = await handleServerRequest<GetImportVehiclesData>({
    path: "/admin/import/vehicles",
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ImportRegisteredVehicles],
      }}
    >
      <InnerImportVehiclesPage defaultData={data ?? { totalCount: 0, vehicles: [] }} />
    </RequiredPermissions>
  );
}
