"use client";

import * as React from "react";
import { GetAuditLogsData } from "@snailycad/types/api";
import { FormField } from "~/components/form/FormField";
import { Select } from "~/components/form/Select";
import { Table, useAsyncTable, useTableState } from "~/components/shared/Table";
import { Title } from "~/components/shared/Title";
import { SearchArea } from "~/components/shared/search/search-area";
import { useTranslations } from "use-intl";
import { useModal } from "~/state/modalState";
import { AuditLogActionType } from "@snailycad/audit-logger";
import dynamic from "next/dynamic";
import { FullDate } from "~/components/shared/FullDate";
import { Button } from "@snailycad/ui";
import { ModalIds } from "~/types/ModalIds";

const ActionTypes = Object.keys(AuditLogActionType);
interface InnerAuditLogsPageProps {
  defaultData: GetAuditLogsData;
}

const ViewAuditLogsDiffModal = dynamic(
  async () =>
    (await import("~/components/admin/manage/audit-logs/view-audit-logs-diff-modal"))
      .ViewAuditLogsDiffModal,
  { ssr: false },
);

export function InnerAuditLogsPage(props: InnerAuditLogsPageProps) {
  const [search, setSearch] = React.useState("");

  const common = useTranslations("Common");
  const t = useTranslations("Management");
  const { openModal } = useModal();

  const asyncTable = useAsyncTable({
    search,
    fetchOptions: {
      path: "/admin/manage/cad-settings/audit-logs",
      onResponse: (data: GetAuditLogsData) => ({
        data: data.logs,
        totalCount: data.totalCount,
      }),
    },
    totalCount: props.defaultData.totalCount,
    initialData: props.defaultData.logs,
  });

  const tableState = useTableState({ pagination: asyncTable.pagination });

  return (
    <>
      <Title>{t("MANAGE_AUDIT_LOGS")}</Title>

      <SearchArea
        totalCount={props.defaultData.totalCount}
        asyncTable={asyncTable}
        search={{ search, setSearch }}
      >
        <FormField className="w-full max-w-[15rem]" label={common("type")}>
          <Select
            isClearable
            value={asyncTable.filters?.type ?? null}
            onChange={(event) =>
              asyncTable.setFilters((prev) => ({ ...prev, type: event.target.value }))
            }
            values={ActionTypes.map((type) => ({
              label: type,
              value: type,
            }))}
          />
        </FormField>
      </SearchArea>

      <Table
        tableState={tableState}
        data={asyncTable.items.map((auditLog) => {
          return {
            id: auditLog.id,
            type: auditLog.action.type,
            executor: auditLog.executor?.username ?? "Public API",
            createdAt: <FullDate>{auditLog.createdAt}</FullDate>,
            actions: (
              <Button onPress={() => openModal(ModalIds.ViewAuditLogData, auditLog)} size="xs">
                {t("viewDiff")}
              </Button>
            ),
          };
        })}
        columns={[
          { header: common("type"), accessorKey: "type" },
          { header: t("executor"), accessorKey: "executor" },
          { header: common("createdAt"), accessorKey: "createdAt" },
          { header: common("actions"), accessorKey: "actions" },
        ]}
      />

      <ViewAuditLogsDiffModal />
    </>
  );
}
