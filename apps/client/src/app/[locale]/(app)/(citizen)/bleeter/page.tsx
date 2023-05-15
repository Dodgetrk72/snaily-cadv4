import { GetBleeterData } from "@snailycad/types/api";
import { handleServerRequest } from "~/lib/fetch/server";
import { InnerBleeterPage } from "./component";

export default async function BleeterPage() {
  const { data } = await handleServerRequest<GetBleeterData>({ path: "/bleeter" });

  return <InnerBleeterPage posts={data ?? { posts: [], totalCount: 0 }} />;
}
