"use client";

import { useTranslations } from "use-intl";
import { Table, useTableState } from "~/components/shared/Table";

export default function ActiveCallsLoadingUI() {
  const t = useTranslations();
  const tableState = useTableState();

  return (
    <div className="mt-3 card">
      <header className="flex items-center justify-between p-2 px-4 bg-gray-200 dark:bg-secondary">
        <h3 className="text-xl font-semibold">{t("Calls.activeCalls")}</h3>
      </header>

      <div className="px-4">
        <Table
          isLoading
          features={{ isWithinCardOrModal: true }}
          tableState={tableState}
          data={[]}
          columns={[
            { header: "#", accessorKey: "caseNumber" },
            { header: t("caller"), accessorKey: "name" },
            { header: t("Common.type"), accessorKey: "type" },
            { header: t("priority"), accessorKey: "priority" },
            { header: t("location"), accessorKey: "location" },
            { header: t("Common.description"), accessorKey: "description" },
            { header: t("situationCode"), accessorKey: "situationCode" },
            { header: t("Common.updatedAt"), accessorKey: "updatedAt" },
            { header: t("assignedUnits"), accessorKey: "assignedUnits" },
          ]}
        />
      </div>
    </div>
  );
}
