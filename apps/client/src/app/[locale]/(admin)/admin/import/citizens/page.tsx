import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { InnerImportCitizensPage } from "./component";

export default async function ImportCitizensPage() {
  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ImportCitizens],
      }}
    >
      <InnerImportCitizensPage />
    </RequiredPermissions>
  );
}
