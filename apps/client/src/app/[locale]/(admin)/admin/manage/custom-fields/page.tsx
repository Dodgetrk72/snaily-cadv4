import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerManageCustomFieldsPage } from "./component";

export default async function ManageCustomFieldsPage() {
  const { data } = await handleServerRequest({
    path: "/admin/manage/custom-fields",
    defaultData: { customFields: [], totalCount: 0 },
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ManageCustomFields, Permissions.ViewCustomFields],
      }}
    >
      <InnerManageCustomFieldsPage defaultData={data} />
    </RequiredPermissions>
  );
}
