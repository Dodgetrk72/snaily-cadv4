import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerCourtEntriesPage } from "./component";
import { GetCourtEntriesData } from "@snailycad/types/api";

export default async function CourtEntriesTabPage() {
  const { data } = await handleServerRequest<GetCourtEntriesData>({
    path: "/court-entries",
    defaultData: { courtEntries: [], totalCount: 0 },
  });

  return <InnerCourtEntriesPage entries={data} />;
}
