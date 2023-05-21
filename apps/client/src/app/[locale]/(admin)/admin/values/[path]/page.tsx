import { ValueType } from "@snailycad/types";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerManageValuesPathPage } from "./component";
import { GetValuesData } from "@snailycad/types/api";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { valueRoutes } from "~/components/admin/sidebar/routes";
import { notFound } from "next/navigation";

interface ManageValuesPageProps {
  params: { path: string };
}

export default async function ManageValuesPage(props: ManageValuesPageProps) {
  const path = (props.params.path as string).replace(/-/g, "_") as Lowercase<ValueType>;
  const type = path.toUpperCase() as ValueType;

  const routeData = valueRoutes.find((v) => v.type === type);
  const { data: valuesForPath } = await handleServerRequest<GetValuesData>({
    path: `/admin/values/${path}?includeAll=false`,
    defaultData: [{ totalCount: 0, values: [], type }],
  });

  if (!Object.keys(ValueType).includes(type)) {
    return notFound();
  }

  return (
    <RequiredPermissions
      permissions={{
        permissions: routeData?.permissions ?? [],
      }}
    >
      <InnerManageValuesPathPage
        type={type}
        valuesForPath={valuesForPath?.[0] ?? { totalCount: 0, type, values: [] }}
      />
    </RequiredPermissions>
  );
}
