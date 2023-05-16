"use client";

import { GetExpungementRequestsData } from "@snailycad/types/api";
import { ExpungementRequestsTab } from "~/components/courthouse/expungement-requests/ExpungementRequestsTab";

interface InnerExpungementRequestsPageProps {
  expungementRequests: GetExpungementRequestsData;
}

export function InnerExpungementRequestsPage(props: InnerExpungementRequestsPageProps) {
  return <ExpungementRequestsTab requests={props.expungementRequests} />;
}
