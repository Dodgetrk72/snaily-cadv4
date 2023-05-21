import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerManageCustomFieldsPage } from "./component";

export default async function ManageCustomFieldsPage() {
  const { data } = await handleServerRequest({
    path: "/admin/manage/custom-fields",
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ManageCustomFields, Permissions.ViewCustomFields],
      }}
    >
      <InnerManageCustomFieldsPage defaultData={data ?? { customFields: [], totalCount: 0 }} />
    </RequiredPermissions>
  );
}
