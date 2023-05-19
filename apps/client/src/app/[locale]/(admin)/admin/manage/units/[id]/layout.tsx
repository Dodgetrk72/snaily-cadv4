import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { ManageUnitByIdTabList } from "./tab-list";

interface ManageUnitByIdLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default async function ManageUnitByIdLayout(props: ManageUnitByIdLayoutProps) {
  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ManageUnits, Permissions.ManageAwardsAndQualifications],
      }}
    >
      <ManageUnitByIdTabList params={props.params}>{props.children}</ManageUnitByIdTabList>
    </RequiredPermissions>
  );
}
