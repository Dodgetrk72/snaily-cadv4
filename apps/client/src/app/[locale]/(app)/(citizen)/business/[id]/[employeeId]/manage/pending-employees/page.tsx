"use client";

import { EmployeeAsEnum } from "@snailycad/types";
import { shallow } from "zustand/shallow";
import { PendingEmployeesTab } from "~/components/business/manage/tabs/pending-employees-tab";
import { useBusinessState } from "~/state/business-state";

export default function BusinessPendingEmployeesPageTab() {
  const { currentEmployee, currentBusiness } = useBusinessState(
    (state) => ({
      currentEmployee: state.currentEmployee,
      currentBusiness: state.currentBusiness,
    }),
    shallow,
  );

  const isBusinessOwner = currentEmployee?.role?.as === EmployeeAsEnum.OWNER;
  const hasManagePermissions = isBusinessOwner || currentEmployee?.canManageEmployees;

  if (!currentBusiness?.whitelisted) {
    return (
      <div>
        {/* todo: improved error message */}
        <p>Business is not whitelisted</p>
      </div>
    );
  }

  if (!hasManagePermissions) {
    return (
      <div>
        {/* todo: improved error message */}
        <p>Insufficient permissions</p>
      </div>
    );
  }

  return <PendingEmployeesTab />;
}
