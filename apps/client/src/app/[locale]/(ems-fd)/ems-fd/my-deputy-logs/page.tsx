import { Permissions } from "@snailycad/permissions";
import { GetMyDeputiesLogsData } from "@snailycad/types/api";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleServerRequest } from "~/lib/fetch/server";
import { InnerMyDeputyLogsPage } from "./component";

export default async function MyDeputyLogsPage() {
  const { data: myDeputyLogs } = await handleServerRequest<GetMyDeputiesLogsData>({
    path: "/ems-fd/logs",
    defaultData: { totalCount: 0, logs: [] },
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.EmsFd],
      }}
    >
      <InnerMyDeputyLogsPage defaultData={myDeputyLogs} />
    </RequiredPermissions>
  );
}
