"use client";

import * as React from "react";
import { AnyValue, ValueType } from "@snailycad/types";
import { DeleteValuesBulkData, GetValuesData, PutValuePositionsData } from "@snailycad/types/api";
import { Button } from "@snailycad/ui";
import { BoxArrowUpRight, InfoCircle } from "react-bootstrap-icons";
import { useTranslations } from "use-intl";
import {
  Table,
  getSelectedTableRows,
  useAsyncTable,
  useTableState,
} from "~/components/shared/Table";
import { Title } from "~/components/shared/Title";
import { Link } from "~/components/shared/link";
import { getObjLength, isEmpty, yesOrNoText } from "~/lib/utils";
import { OptionsDropdown } from "~/components/admin/values/import/options-dropdown";
import { SearchArea } from "~/components/shared/search/search-area";
import { ModalIds } from "~/types/ModalIds";
import { useModal } from "~/state/modalState";
import {
  getCreatedAtFromValue,
  getDisabledFromValue,
  getValueStrFromValue,
  hasTableDataChanged,
} from "~/lib/admin/values/utils";
import { FullDate } from "~/components/shared/FullDate";
import * as Tooltip from "@radix-ui/react-tooltip";
import { isValueInUse } from "~/lib/admin/values/isValueInUse";
import { useAuth } from "~/context/auth-context";
import { useTableDataOfType, useTableHeadersOfType } from "~/lib/admin/values/values";
import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { useTemporaryItem } from "~/hooks/shared/useTemporaryItem";
import dynamic from "next/dynamic";
import useFetch from "~/lib/useFetch";
import { toastMessage } from "~/lib/toastMessage";

const ManageValueModal = dynamic(
  async () => (await import("~/components/admin/values/ManageValueModal")).ManageValueModal,
  { ssr: false },
);

const AlertDeleteValueModal = dynamic(
  async () =>
    (await import("~/components/admin/values/alert-delete-value-modal")).AlertDeleteValueModal,
  { ssr: false },
);

const ImportValuesModal = dynamic(
  async () =>
    (await import("~/components/admin/values/import/import-values-modal")).ImportValuesModal,
  { ssr: false },
);

const AlertModal = dynamic(async () => (await import("~/components/modal/AlertModal")).AlertModal, {
  ssr: false,
});

interface InnerManageValuesPathPage {
  type: ValueType;
  valuesForPath: GetValuesData[number];
}

export function InnerManageValuesPathPage(props: InnerManageValuesPathPage) {
  const t = useTranslations("Values");
  const typeT = useTranslations(props.type);
  const common = useTranslations("Common");
  const { closeModal, openModal } = useModal();
  const { user } = useAuth();
  const { state, execute } = useFetch();

  const [search, setSearch] = React.useState("");
  const [allSelected, setAllSelected] = React.useState(false);

  const asyncTable = useAsyncTable({
    search,
    fetchOptions: {
      onResponse(json: GetValuesData) {
        const [forType] = json;
        if (!forType)
          return { data: props.valuesForPath.values, totalCount: props.valuesForPath.totalCount };
        return { data: forType.values, totalCount: forType.totalCount };
      },
      path: `/admin/values/${props.type.toLowerCase()}?includeAll=false`,
    },
    initialData: props.valuesForPath.values,
    totalCount: props.valuesForPath.totalCount,
  });

  const [tempValue, valueState] = useTemporaryItem(asyncTable.items);
  const documentationUrl = createValueDocumentationURL(props.type);
  const tableState = useTableState({
    pagination: asyncTable.pagination,
    dragDrop: { onListChange: setList },
  });

  const extraTableHeaders = useTableHeadersOfType(props.type);
  const extraTableData = useTableDataOfType(props.type);
  const tableHeaders = React.useMemo(() => {
    return [
      user?.developerMode ? { header: "ID", accessorKey: "id" } : null,
      { header: "Value", accessorKey: "value" },
      ...extraTableHeaders,
      { header: t("isDisabled"), accessorKey: "isDisabled" },
      { header: common("createdAt"), accessorKey: "createdAt" },
      { header: common("actions"), accessorKey: "actions" },
    ] as AccessorKeyColumnDef<{ id: string }, "id">[];
  }, [extraTableHeaders, t, common, user?.developerMode]);

  function handleDeleteClick(value: AnyValue) {
    valueState.setTempId(value.id);
    openModal(ModalIds.AlertDeleteValue);
  }

  function handleEditClick(value: AnyValue) {
    valueState.setTempId(value.id);
    openModal(ModalIds.ManageValue);
  }

  async function setList(list: AnyValue[]) {
    if (!hasTableDataChanged(asyncTable.items, list)) return;

    for (const [index, value] of list.entries()) {
      if ("position" in value) {
        value.position = index;
      } else {
        value.value.position = index;
      }

      asyncTable.move(value.id, index);
      asyncTable.update(value.id, value);
    }

    await execute<PutValuePositionsData>({
      path: `/admin/values/${props.type.toLowerCase()}/positions`,
      method: "PUT",
      data: {
        ids: list.map((v) => {
          return "createdAt" in v ? v.id : v.valueId;
        }),
      },
    });
  }
  async function handleDeleteSelected() {
    const selectedRows = allSelected
      ? { all: true }
      : getSelectedTableRows(props.valuesForPath.values, tableState.rowSelection);

    const { json } = await execute<DeleteValuesBulkData>({
      path: `/admin/values/${props.type.toLowerCase()}/bulk-delete`,
      method: "DELETE",
      data: selectedRows,
    });

    if (json) {
      if (Array.isArray(selectedRows)) {
        asyncTable.remove(...selectedRows);
      } else {
        asyncTable.setItems([]);
      }

      setAllSelected(false);
      tableState.setRowSelection({});
      closeModal(ModalIds.AlertDeleteSelectedValues);
      valueState.setTempId(null);

      toastMessage({
        title: "Delete Values",
        icon: "info",
        message: t("deletedSelectedValues", {
          failed: json.failed,
          deleted: json.success,
        }),
      });
    }
  }

  return (
    <>
      <header className="flex items-center justify-between">
        <div>
          <Title className="!mb-0">{typeT("MANAGE")}</Title>
          <h2 className="text-lg font-semibold">
            {t("totalItems")}:{" "}
            <span className="font-normal">{asyncTable.pagination.totalDataCount}</span>
          </h2>
          <Link
            className="mt-1 underline flex items-center gap-1 text-blue-500"
            target="_blank"
            href={documentationUrl}
          >
            {common("learnMore")}
            <BoxArrowUpRight className="inline-block" />
          </Link>
        </div>

        <div className="flex gap-2">
          {isEmpty(tableState.rowSelection) ? null : (
            <Button onPress={() => openModal(ModalIds.AlertDeleteSelectedValues)} variant="danger">
              {t("deleteSelectedValues")}
            </Button>
          )}
          <Button onPress={() => openModal(ModalIds.ManageValue)}>{typeT("ADD")}</Button>
          <OptionsDropdown type={props.type} valueLength={asyncTable.items.length} />
        </div>
      </header>

      <SearchArea
        search={{ search, setSearch }}
        asyncTable={asyncTable}
        totalCount={props.valuesForPath.totalCount}
      />

      {!allSelected &&
      getObjLength(tableState.rowSelection) === tableState.pagination.pageSize &&
      props.valuesForPath.totalCount > tableState.pagination.pageSize ? (
        <div className="flex items-center gap-2 px-4 py-2 card my-3 !bg-slate-900 !border-slate-500 border-2">
          <InfoCircle />
          <span>
            {getObjLength(tableState.rowSelection)} items selected.{" "}
            <Button
              onClick={() => setAllSelected(true)}
              variant="transparent"
              className="underline"
              size="xs"
            >
              Select all {props.valuesForPath.totalCount}?
            </Button>
          </span>
        </div>
      ) : null}

      {allSelected ? (
        <div className="flex items-center gap-2 px-4 py-2 card my-3 !bg-slate-900 !border-slate-500 border-2">
          <InfoCircle />
          <span>{props.valuesForPath.totalCount} items selected. </span>
        </div>
      ) : null}

      {asyncTable.noItemsAvailable ? (
        <p className="text-neutral-800 dark:text-gray-400">
          There are no values yet for this type.
        </p>
      ) : (
        <Table
          tableState={tableState}
          features={{ dragAndDrop: true, rowSelection: true }}
          containerProps={{
            style: { overflowY: "auto", maxHeight: "75vh" },
          }}
          data={asyncTable.items.map((value) => ({
            id: value.id,
            rowProps: { value },
            value: getValueStrFromValue(value),
            ...extraTableData(value),
            isDisabled: common(yesOrNoText(getDisabledFromValue(value))),
            createdAt: <FullDate>{getCreatedAtFromValue(value)}</FullDate>,
            actions: (
              <>
                <Button size="xs" onPress={() => handleEditClick(value)} variant="success">
                  {common("edit")}
                </Button>

                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <Button
                        size="xs"
                        onPress={() => handleDeleteClick(value)}
                        variant="danger"
                        className="ml-2"
                        disabled={isValueInUse(value)}
                      >
                        {common("delete")}
                      </Button>
                    </Tooltip.Trigger>

                    {isValueInUse(value) ? (
                      <Tooltip.Portal className="z-[999]">
                        <Tooltip.Content
                          align="center"
                          side="left"
                          sideOffset={5}
                          className="rounded-md bg-white dark:bg-tertiary dark:text-white p-4 max-w-[350px]"
                        >
                          You cannot delete this value because it is being used by another database
                          item. You must first delete that item.
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    ) : null}
                  </Tooltip.Root>
                </Tooltip.Provider>
              </>
            ),
          }))}
          columns={tableHeaders}
        />
      )}

      <AlertDeleteValueModal
        type={props.type}
        valueState={[tempValue, valueState]}
        asyncTable={asyncTable}
      />

      <AlertModal
        id={ModalIds.AlertDeleteSelectedValues}
        description={t.rich("alert_deleteSelectedValues", {
          span: (children) => <span className="font-semibold">{children}</span>,
          length: allSelected
            ? props.valuesForPath.totalCount
            : getObjLength(tableState.rowSelection),
        })}
        onDeleteClick={handleDeleteSelected}
        title={typeT("DELETE")}
        state={state}
      />

      <ManageValueModal
        onCreate={(value) => {
          asyncTable.append(value);
        }}
        onUpdate={(previousValue, newValue) => {
          asyncTable.update(previousValue.id, newValue);
          valueState.setTempId(null);
        }}
        value={tempValue}
        type={props.type}
      />
      <ImportValuesModal onImport={(data) => asyncTable.append(...data)} type={props.type} />
    </>
  );
}

export function createValueDocumentationURL(type: ValueType) {
  const transformedPaths: Partial<Record<ValueType, string>> = {
    [ValueType.DRIVERSLICENSE_CATEGORY]: "license-category",
    [ValueType.BLOOD_GROUP]: "bloodgroup",
  };

  const path = transformedPaths[type] ?? type.replace(/_/g, "-").toLowerCase();
  return `https://docs.snailycad.org/docs/features/general/values/${path}`;
}
