import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { InnerManageCitizenByIdPage } from "./component";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { GetManageCitizenByIdData } from "@snailycad/types/api";
import { notFound } from "next/navigation";

interface ManageCitizenByIdPageProps {
  params: { id: string };
}

export default async function ManageCitizenByIdPage(props: ManageCitizenByIdPageProps) {
  const { data: citizen } = await handleServerRequest<GetManageCitizenByIdData | null>({
    path: `/admin/manage/citizens/${props.params.id}`,
    defaultData: null,
  });

  if (!citizen) {
    return notFound();
  }

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ManageCitizens],
      }}
    >
      <InnerManageCitizenByIdPage citizen={citizen} />
    </RequiredPermissions>
  );
}
