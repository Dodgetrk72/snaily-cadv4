import { GetBleeterData } from "@snailycad/types/api";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerBleeterPage } from "./component";

export default async function BleeterPage() {
  const { data } = await handleServerRequest<GetBleeterData>({
    path: "/bleeter",
    defaultData: { posts: [], totalCount: 0 },
  });

  return <InnerBleeterPage posts={data} />;
}
