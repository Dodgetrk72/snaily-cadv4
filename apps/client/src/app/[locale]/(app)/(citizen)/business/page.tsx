import { GetBusinessesData } from "@snailycad/types/api";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerMyBusinessesPage } from "./component";

export default async function MyBusinessesPage() {
  const { data } = await handleServerRequest<GetBusinessesData>({
    path: "/businesses",
    defaultData: { joinableBusinesses: [], joinedBusinesses: [], ownedBusinesses: [] },
  });

  return <InnerMyBusinessesPage defaultData={data} />;
}
