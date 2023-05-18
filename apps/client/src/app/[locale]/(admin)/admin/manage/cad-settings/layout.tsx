import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { CADSettingsTabList } from "./tab-list";

interface CADSettingsLayoutProps {
  children: React.ReactNode;
}

export default function CADSettingsLayout(props: CADSettingsLayoutProps) {
  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ManageCADSettings],
      }}
    >
      <CADSettingsTabList>{props.children}</CADSettingsTabList>
    </RequiredPermissions>
  );
}
