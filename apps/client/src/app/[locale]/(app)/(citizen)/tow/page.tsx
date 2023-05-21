import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { InnerTowPage } from "./component";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { GetTowCallsData } from "@snailycad/types/api";

export default async function TowPage() {
  const { data } = await handleServerRequest<GetTowCallsData>({ path: "/tow" });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ViewTowCalls, Permissions.ManageTowCalls],
      }}
    >
      <InnerTowPage calls={data ?? []} />
    </RequiredPermissions>
  );
}
