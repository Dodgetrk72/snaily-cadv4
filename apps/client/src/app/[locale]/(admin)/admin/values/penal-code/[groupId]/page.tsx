import { handleServerRequest } from "~/lib/fetch/server";
import { InnerPenalCodePage } from "./component";
import { GetValuesPenalCodesData } from "@snailycad/types/api";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { Permissions } from "@snailycad/permissions";

interface ManagePenalCodesByGroupPageProps {
  params: { groupId: string };
}

export default async function ManagePenalCodesByGroupPage(props: ManagePenalCodesByGroupPageProps) {
  const { data: penalCodesData } = await handleServerRequest<GetValuesPenalCodesData[number]>({
    path: `/admin/values/penal_code?groupId=${props.params.groupId}&includeAll=false&cache=false`,
  });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ManageValuePenalCode],
      }}
    >
      <InnerPenalCodePage
        penalCodes={penalCodesData ?? { values: [], type: "PENAL_CODE", totalCount: 0 }}
      />
    </RequiredPermissions>
  );
}