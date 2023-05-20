"use client";

import { GetManageExpungementRequests } from "@snailycad/types/api";
import { ExpungementRequestsTab } from "~/components/admin/manage/courthouse/expungement-requests-tab";

interface InnerManageExpungementRequestsTabPageProps {
  defaultData: GetManageExpungementRequests;
}

export function InnerManageExpungementRequestsTabPage(
  props: InnerManageExpungementRequestsTabPageProps,
) {
  return <ExpungementRequestsTab requests={props.defaultData} />;
}
