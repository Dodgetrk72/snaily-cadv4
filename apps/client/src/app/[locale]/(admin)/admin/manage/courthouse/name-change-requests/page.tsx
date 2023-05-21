import { Permissions } from "@snailycad/permissions";
import { GetManageNameChangeRequests } from "@snailycad/types/api";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerManageNameChangeRequestsTabPage } from "./component";

export default async function ManageCourthouseNameChangeRequests() {
  const { data } = await handleServerRequest<GetManageNameChangeRequests>({
    path: "/admin/manage/name-change-requests",
    defaultData: { pendingNameChangeRequests: [], totalCount: 0 },
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ViewNameChangeRequests, Permissions.ManageNameChangeRequests],
      }}
    >
      <InnerManageNameChangeRequestsTabPage defaultData={data} />
    </RequiredPermissions>
  );
}
