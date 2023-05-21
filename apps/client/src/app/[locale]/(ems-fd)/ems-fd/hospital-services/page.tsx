import { Permissions } from "@snailycad/permissions";
import { GetDeadCitizensData } from "@snailycad/types/api";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleServerRequest } from "~/lib/fetch/server";
import { InnerHospitalServicesPage } from "./component";

export default async function EmsFdHospitalServices() {
  const { data } = await handleServerRequest<GetDeadCitizensData>({
    path: "/ems-fd/dead-citizens",
    defaultData: { citizens: [], totalCount: 0 },
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ViewDeadCitizens, Permissions.ManageDeadCitizens],
      }}
    >
      <InnerHospitalServicesPage defaultData={data} />
    </RequiredPermissions>
  );
}
