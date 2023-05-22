"use client";

import { useTranslations } from "use-intl";
import { Table, useTableState } from "~/components/shared/Table";

export default function BolosLoadingUI() {
  const t = useTranslations();
  const tableState = useTableState();

  return (
    <div className="mt-3 card">
      <header className="flex items-center justify-between p-2 px-4 bg-gray-200 dark:bg-secondary">
        <h3 className="text-xl font-semibold">{t("Bolos.activeBolos")}</h3>
      </header>

      <div className="px-4">
        <Table
          isLoading
          features={{ isWithinCardOrModal: true }}
          tableState={tableState}
          data={[]}
          columns={[
            { header: t("Common.type"), accessorKey: "type" },
            { header: t("Common.name"), accessorKey: "name" },
            { header: t("Leo.model"), accessorKey: "model" },
            { header: t("Leo.plate"), accessorKey: "plate" },
            { header: t("Leo.color"), accessorKey: "color" },
            { header: t("Leo.officer"), accessorKey: "officer" },
            { header: t("Common.description"), accessorKey: "description" },
            { header: t("Common.createdAt"), accessorKey: "createdAt" },
            { header: t("Common.actions"), accessorKey: "actions" },
          ]}
        />
      </div>
    </div>
  );
}
