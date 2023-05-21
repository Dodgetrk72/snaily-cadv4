import { InnerManagePendingUsersPage } from "./component";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";

export default async function ManagePendingUsersTabPage() {
  const { data } = await handleServerRequest({
    path: "/admin/manage/users?pendingOnly=true",
  });

  return (
    <InnerManagePendingUsersPage
      defaultData={data ?? { pendingCount: 0, totalCount: 0, users: [] }}
    />
  );
}
