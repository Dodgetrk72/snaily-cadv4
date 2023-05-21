import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerImportWeaponsPage } from "./component";
import { GetImportWeaponsData } from "@snailycad/types/api";

export default async function ImportWeaponsPage() {
  const { data } = await handleServerRequest<GetImportWeaponsData>({
    path: "/admin/import/weapons",
    defaultData: { totalCount: 0, weapons: [] },
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ImportRegisteredWeapons],
      }}
    >
      <InnerImportWeaponsPage defaultData={data} />
    </RequiredPermissions>
  );
}
