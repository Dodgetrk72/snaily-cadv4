import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { InnerManageUserByIdPage } from "./component";
import { handleMultiServerRequest } from "~/lib/fetch/server";
import { GetCustomRolesData, GetManageUserByIdData } from "@snailycad/types/api";
import { notFound } from "next/navigation";

interface ManageUserByIdPageProps {
  params: { id: string };
}

export default async function ManageUserByIdPage(props: ManageUserByIdPageProps) {
  const [user, customRoles] = await handleMultiServerRequest<
    [GetManageUserByIdData | null, GetCustomRolesData]
  >([
    { path: `/admin/manage/users/${props.params.id}`, defaultData: null },
    {
      path: "/admin/manage/custom-roles?includeAll=true",
      defaultData: { totalCount: 0, customRoles: [] },
    },
  ]);

  if (!user) {
    return notFound();
  }

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.BanUsers, Permissions.ManageUsers, Permissions.DeleteUsers],
      }}
    >
      <InnerManageUserByIdPage user={user} customRoles={customRoles} />
    </RequiredPermissions>
  );
}
