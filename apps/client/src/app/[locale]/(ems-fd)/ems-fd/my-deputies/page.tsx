import { Permissions } from "@snailycad/permissions";
import { GetMyDeputiesData } from "@snailycad/types/api";
import { RequiredPermissions } from "~/components/admin/required-permissions";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerMyDeputiesPage } from "./component";

export default async function MyEmsFdDeputiesPage() {
  const { data: myDeputies } = await handleServerRequest<GetMyDeputiesData>({
    path: "/ems-fd",
    defaultData: { totalCount: 0, deputies: [] },
  });

  return (
    <main>
      <RequiredPermissions
        permissions={{
          permissions: [Permissions.EmsFd],
        }}
      >
        <InnerMyDeputiesPage defaultData={myDeputies} />
      </RequiredPermissions>
    </main>
  );
}
