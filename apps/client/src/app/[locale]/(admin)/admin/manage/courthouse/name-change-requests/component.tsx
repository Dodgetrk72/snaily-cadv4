"use client";

import { GetManageNameChangeRequests } from "@snailycad/types/api";
import { NameChangeRequestsTab } from "~/components/admin/manage/courthouse/name-change-requests-tab";

interface InnerManageNameChangeRequestsTabPageProps {
  defaultData: GetManageNameChangeRequests;
}

export function InnerManageNameChangeRequestsTabPage(
  props: InnerManageNameChangeRequestsTabPageProps,
) {
  return <NameChangeRequestsTab requests={props.defaultData} />;
}
