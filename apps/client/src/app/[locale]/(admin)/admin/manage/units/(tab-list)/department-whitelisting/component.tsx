"use client";

import { GetManageUnitsData } from "@snailycad/types/api";
import { DepartmentWhitelistingTab } from "~/components/admin/manage/units/tabs/department-whitelisting-tab";

interface InnerManageUnitsDepartmentWhitelistingPageTabProps {
  defaultData: GetManageUnitsData;
}

export function InnerManageUnitsDepartmentWhitelistingPageTab(
  props: InnerManageUnitsDepartmentWhitelistingPageTabProps,
) {
  return <DepartmentWhitelistingTab pendingUnits={props.defaultData} />;
}
