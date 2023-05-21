import { GetBusinessesData } from "@snailycad/types/api";
import { handleServerRequest } from "~/lib/fetch/server";
import { InnerMyBusinessesPage } from "./component";

export default async function MyBusinessesPage() {
  const { data } = await handleServerRequest<GetBusinessesData>({
    path: "/businesses",
  });

  return (
    <InnerMyBusinessesPage
      defaultData={data ?? { joinableBusinesses: [], joinedBusinesses: [], ownedBusinesses: [] }}
    />
  );
}