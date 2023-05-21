import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { InnerManageUnitByIdPage } from "./component";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import type { GetManageUnitByIdData } from "@snailycad/types/api";
import { notFound } from "next/navigation";

interface ManageUnitByIdPageProps {
  params: { id: string };
}

export default async function ManageUnitByIdPage(props: ManageUnitByIdPageProps) {
  const { data: unit } = await handleServerRequest<GetManageUnitByIdData | null>({
    path: `/admin/manage/units/${props.params.id}`,
  });

  if (!unit) {
    return notFound();
  }

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ManageUnits, Permissions.ManageAwardsAndQualifications],
      }}
    >
      <InnerManageUnitByIdPage unit={unit} />
    </RequiredPermissions>
  );
}
