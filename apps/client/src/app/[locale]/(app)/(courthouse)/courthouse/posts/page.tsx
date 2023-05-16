import { handleServerRequest } from "~/lib/fetch/server";
import { InnerCourtPostsPage } from "./component";
import { GetCourthousePostsData } from "@snailycad/types/api";

export default async function CourtEntriesTabPage() {
  const { data } = await handleServerRequest<GetCourthousePostsData>({ path: "/courthouse-posts" });
  return <InnerCourtPostsPage posts={data ?? { courthousePosts: [], totalCount: 0 }} />;
}
