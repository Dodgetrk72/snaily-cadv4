import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleServerRequest } from "~/lib/fetch/server";
import { InnerImportWeaponsPage } from "./component";
import { GetImportWeaponsData } from "@snailycad/types/api";

export default async function ImportWeaponsPage() {
  const { data } = await handleServerRequest<GetImportWeaponsData>({
    path: "/admin/import/weapons",
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ImportRegisteredWeapons],
      }}
    >
      <InnerImportWeaponsPage defaultData={data ?? { totalCount: 0, weapons: [] }} />
    </RequiredPermissions>
  );
}
