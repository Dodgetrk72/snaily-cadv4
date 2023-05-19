"use client";

import { EmployeeAsEnum } from "@snailycad/types";
import { BusinessRolesTab } from "~/components/business/manage/tabs/roles-tab/business-roles-tab";
import { useBusinessState } from "~/state/business-state";

export default function BusinessRolesPageTab() {
  const currentEmployee = useBusinessState((state) => state.currentEmployee);
  const isBusinessOwner = currentEmployee?.role?.as === EmployeeAsEnum.OWNER;

  if (!isBusinessOwner) {
    return (
      <div>
        {/* todo */}
        <p>Insufficient permissions</p>
      </div>
    );
  }

  return <BusinessRolesTab />;
}
