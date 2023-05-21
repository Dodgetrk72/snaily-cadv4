import { Permissions } from "@snailycad/permissions";
import { GetManageExpungementRequests } from "@snailycad/types/api";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerManageExpungementRequestsTabPage } from "./component";

export default async function ManageCourthouseExpungementRequests() {
  const { data } = await handleServerRequest<GetManageExpungementRequests>({
    path: "/admin/manage/expungement-requests",
    defaultData: { pendingExpungementRequests: [], totalCount: 0 },
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ViewExpungementRequests, Permissions.ManageExpungementRequests],
      }}
    >
      <InnerManageExpungementRequestsTabPage defaultData={data} />
    </RequiredPermissions>
  );
}
