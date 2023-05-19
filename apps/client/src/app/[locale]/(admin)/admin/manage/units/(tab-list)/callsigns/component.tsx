"use client";

import { GetManageUnitsData } from "@snailycad/types/api";
import { CallsignsTab } from "~/components/admin/manage/units/tabs/callsigns-tab/callsigns-tab";

interface InnerManageUnitsCallsignsPageTabProps {
  defaultData: GetManageUnitsData;
}

export function InnerManageUnitsCallsignsPageTab(props: InnerManageUnitsCallsignsPageTabProps) {
  return <CallsignsTab units={props.defaultData} />;
}
