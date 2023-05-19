"use client";

import { GetManageUnitsData } from "@snailycad/types/api";
import { AllUnitsTab } from "~/components/admin/manage/units/tabs/all-units-tab";

interface InnerManageUnitsPageProps {
  defaultData: GetManageUnitsData;
}

export function InnerManageUnitsPage(props: InnerManageUnitsPageProps) {
  return <AllUnitsTab units={props.defaultData} />;
}
