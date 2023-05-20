import { Permissions } from "@snailycad/permissions";
import { GetManageNameChangeRequests } from "@snailycad/types/api";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleServerRequest } from "~/lib/fetch/server";
import { InnerManageNameChangeRequestsTabPage } from "./component";

export default async function ManageCourthouseNameChangeRequests() {
  const { data } = await handleServerRequest<GetManageNameChangeRequests>({
    path: "/admin/manage/name-change-requests",
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ViewNameChangeRequests, Permissions.ManageNameChangeRequests],
      }}
    >
      <InnerManageNameChangeRequestsTabPage
        defaultData={data ?? { pendingNameChangeRequests: [], totalCount: 0 }}
      />
    </RequiredPermissions>
  );
}
