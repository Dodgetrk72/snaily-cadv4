"use client";

import { GetDepartmentTimeLogsDepartmentsData } from "@snailycad/types/api";
import { DepartmentTimeLogsTab } from "~/components/admin/manage/units/tabs/department-time-logs/department-time-logs-table";

interface InnerManageUnitsDepartmentTimeLogsPageTabProps {
  defaultData: GetDepartmentTimeLogsDepartmentsData;
}

export function InnerManageUnitsDepartmentTimeLogsPageTab(
  props: InnerManageUnitsDepartmentTimeLogsPageTabProps,
) {
  return <DepartmentTimeLogsTab {...props} />;
}
