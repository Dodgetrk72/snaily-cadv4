import { Permissions } from "@snailycad/permissions";
import { GetManageBusinessByIdEmployeesData } from "@snailycad/types/api";
import { notFound } from "next/navigation";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleServerRequest } from "~/lib/fetch/server";
import { InnerManageBusinessByIdPage } from "./component";

interface ManageBusinessByIdPageProps {
  params: { id: string };
}

export default async function ManageBusinessByIdPage(props: ManageBusinessByIdPageProps) {
  const { data } = await handleServerRequest<GetManageBusinessByIdEmployeesData>({
    path: `/admin/manage/businesses/${props.params.id}/employees`,
  });

  if (!data) {
    return notFound();
  }

  return (
    <RequiredPermissions
      permissions={{
        permissions: [
          Permissions.ViewBusinesses,
          Permissions.DeleteBusinesses,
          Permissions.ManageBusinesses,
        ],
      }}
    >
      <InnerManageBusinessByIdPage business={data} params={props.params} />
    </RequiredPermissions>
  );
}
