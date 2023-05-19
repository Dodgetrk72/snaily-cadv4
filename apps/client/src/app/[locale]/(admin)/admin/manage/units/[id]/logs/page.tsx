import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { InnerManageUnitByIdPageLogsTab } from "./component";
import { handleServerRequest } from "~/lib/fetch/server";
import type { GetManageUnitByIdData } from "@snailycad/types/api";
import { notFound } from "next/navigation";

interface ManageUnitByIdPageLogsTabProps {
  params: { id: string };
}

export default async function ManageUnitByIdPageLogsTab(props: ManageUnitByIdPageLogsTabProps) {
  const { data: unit } = await handleServerRequest<GetManageUnitByIdData | null>({
    path: `/admin/manage/units/${props.params.id}`,
  });

  if (!unit) {
    return notFound();
  }

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ManageUnits],
      }}
    >
      <InnerManageUnitByIdPageLogsTab unit={unit} />
    </RequiredPermissions>
  );
}
