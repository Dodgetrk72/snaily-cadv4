"use client";

import { GetNameChangeRequestsData } from "@snailycad/types/api";
import { NameChangeRequestTab } from "~/components/courthouse/name-change/NameChangeRequestTab";

interface InnerNameChangeRequestsPageProps {
  nameChangeRequests: GetNameChangeRequestsData;
}

export function InnerNameChangeRequestsPage(props: InnerNameChangeRequestsPageProps) {
  return <NameChangeRequestTab requests={props.nameChangeRequests} />;
}
