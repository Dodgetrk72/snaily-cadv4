import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { InnerTowLogsPage } from "./component";
import { handleServerRequest } from "~/lib/fetch/server";
import { GetTowCallsData } from "@snailycad/types/api";

export default async function TowLogsPage() {
  const { data } = await handleServerRequest<GetTowCallsData>({ path: "/tow?ended=true" });

  return (
    <RequiredPermissions permissions={{ permissions: [Permissions.ViewTowLogs] }}>
      <InnerTowLogsPage calls={data ?? []} />
    </RequiredPermissions>
  );
}
