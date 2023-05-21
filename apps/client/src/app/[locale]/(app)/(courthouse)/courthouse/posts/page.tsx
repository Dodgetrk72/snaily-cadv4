import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerCourtPostsPage } from "./component";
import { GetCourthousePostsData } from "@snailycad/types/api";

export default async function CourtEntriesTabPage() {
  const { data } = await handleServerRequest<GetCourthousePostsData>({
    path: "/courthouse-posts",
    defaultData: { courthousePosts: [], totalCount: 0 },
  });

  return <InnerCourtPostsPage posts={data} />;
}
