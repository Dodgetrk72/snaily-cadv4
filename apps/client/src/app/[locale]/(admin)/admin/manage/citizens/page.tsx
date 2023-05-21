import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { InnerManageCitizenByIdPage } from "./component";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { GetManageCitizensData } from "@snailycad/types/api";

export default async function ManageCitizenByIdPage() {
  const { data: citizens } = await handleServerRequest<GetManageCitizensData>({
    path: "/admin/manage/citizens",
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [
          Permissions.ViewCitizens,
          Permissions.DeleteCitizens,
          Permissions.ManageCitizens,
        ],
      }}
    >
      <InnerManageCitizenByIdPage defaultData={citizens ?? { citizens: [], totalCount: 0 }} />
    </RequiredPermissions>
  );
}
