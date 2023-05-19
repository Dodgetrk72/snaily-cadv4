"use client";

import { EmployeeAsEnum } from "@snailycad/types";
import { VehiclesTab } from "~/components/business/manage/tabs/vehicles-tab";
import { useBusinessState } from "~/state/business-state";

export default function BusinessVehiclesPageTab() {
  const currentEmployee = useBusinessState((state) => state.currentEmployee);
  const isBusinessOwner = currentEmployee?.role?.as === EmployeeAsEnum.OWNER;
  const hasManagePermissions = isBusinessOwner || currentEmployee?.canManageVehicles;

  if (!hasManagePermissions) {
    return (
      <div>
        {/* todo */}
        <p>Insufficient permissions</p>
      </div>
    );
  }

  return <VehiclesTab />;
}
