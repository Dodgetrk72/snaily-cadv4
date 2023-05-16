"use client";

import { GetCourthousePostsData } from "@snailycad/types/api";
import { CourthousePostsTab } from "~/components/courthouse/courthouse-posts/CourthousePostsTab";
import { useFeatureEnabled } from "~/hooks/useFeatureEnabled";

interface InnerCourtPostsPageProps {
  posts: GetCourthousePostsData;
}

export function InnerCourtPostsPage(props: InnerCourtPostsPageProps) {
  const { COURTHOUSE_POSTS } = useFeatureEnabled();

  if (!COURTHOUSE_POSTS) {
    return null;
  }

  return <CourthousePostsTab posts={props.posts} />;
}
