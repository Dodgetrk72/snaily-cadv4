import { Permissions } from "@snailycad/permissions";
import { GetManagePendingWarrants } from "@snailycad/types/api";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerManagePendingWarrantsTabPage } from "./component";

export default async function ManageCourthouseNameChangeRequests() {
  const { data } = await handleServerRequest<GetManagePendingWarrants>({
    path: "/admin/manage/pending-warrants",
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ManagePendingWarrants],
      }}
    >
      <InnerManagePendingWarrantsTabPage
        defaultData={data ?? { pendingWarrants: [], totalCount: 0 }}
      />
    </RequiredPermissions>
  );
}
