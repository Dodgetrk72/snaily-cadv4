"use client";

import { EmployeeAsEnum } from "@snailycad/types";
import { ManageBusinessTab } from "~/components/business/manage/tabs/business-tab";
import { useBusinessState } from "~/state/business-state";

export default function BusinessSettingsPageTab() {
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

  return <ManageBusinessTab />;
}
