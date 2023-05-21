import { Permissions } from "@snailycad/permissions";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { InnerTaxiPage } from "./component";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { GetTaxiCallsData } from "@snailycad/types/api";

export async function TaxiPage() {
  const { data } = await handleServerRequest<GetTaxiCallsData>({ path: "/taxi" });

  return (
    <RequiredPermissions
      permissions={{
        permissions: [Permissions.ViewTaxiCalls, Permissions.ManageTaxiCalls],
      }}
    >
      <InnerTaxiPage calls={data ?? []} />
    </RequiredPermissions>
  );
}
