import { defaultPermissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { InnerAuditLogsPage } from "./component";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { GetAuditLogsData } from "@snailycad/types/api";

export default async function AuditLogsPage() {
  const { data } = await handleServerRequest<GetAuditLogsData>({
    path: "/admin/manage/cad-settings/audit-logs",
    defaultData: { logs: [], totalCount: 0 },
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: defaultPermissions.allDefaultAdminPermissions,
      }}
    >
      <InnerAuditLogsPage defaultData={data} />
    </RequiredPermissions>
  );
}
