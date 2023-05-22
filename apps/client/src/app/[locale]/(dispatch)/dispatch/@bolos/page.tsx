import { GetBolosData } from "@snailycad/types/api";
import { ActiveBolos } from "~/components/active-bolos/active-bolos";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";

export default async function ActiveBolosSegment() {
  const { data } = await handleServerRequest<GetBolosData>({
    path: "/bolos",
    defaultData: { bolos: [], totalCount: 0 },
  });

  return <ActiveBolos initialBolos={data} />;
}
