import { RequiredPermissions } from "~/components/admin/required-permissions";
import { InnerDispatchMapPage } from "./component";
import { Permissions } from "@snailycad/permissions";
import { getDispatchData } from "../page";

export default async function DispatchMapPage() {
  const dispatchData = await getDispatchData();

  return (
    <main>
      <RequiredPermissions
        permissions={{
          permissions: [Permissions.LiveMap],
        }}
      >
        <InnerDispatchMapPage
          activeDeputies={dispatchData.activeDeputies}
          activeOfficers={dispatchData.activeOfficers}
          bolos={dispatchData.bolos}
          calls={dispatchData.calls}
        />
      </RequiredPermissions>
    </main>
  );
}
