"use client";

import * as React from "react";
import { PenalCodeGroup, ValueType } from "@snailycad/types";
import { DeletePenalCodeGroupsData, PutValuePositionsData } from "@snailycad/types/api";
import { Button, buttonSizes, buttonVariants } from "@snailycad/ui";
import { BoxArrowUpRight } from "react-bootstrap-icons";
import { useTranslations } from "use-intl";
import { Table, useAsyncTable, useTableState } from "~/components/shared/Table";
import { Title } from "~/components/shared/Title";
import { Link } from "~/components/shared/link";
import { OptionsDropdown } from "~/components/admin/values/import/options-dropdown";
import { SearchArea } from "~/components/shared/search/search-area";
import { ModalIds } from "~/types/ModalIds";
import { useModal } from "~/state/modalState";
import { hasTableDataChanged } from "~/lib/admin/values/utils";

import { useTemporaryItem } from "~/hooks/shared/useTemporaryItem";
import dynamic from "next/dynamic";
import useFetch from "~/lib/useFetch";
import { useRouter } from "next/navigation";
import { classNames } from "~/lib/classNames";

const ImportValuesModal = dynamic(
  async () =>
    (await import("~/components/admin/values/import/import-values-modal")).ImportValuesModal,
  { ssr: false },
);

const ManagePenalCodeGroup = dynamic(
  async () =>
    (await import("components/admin/values/penal-codes/manage-penal-code-group-modal"))
      .ManagePenalCodeGroup,
  { ssr: false },
);

const AlertModal = dynamic(async () => (await import("~/components/modal/AlertModal")).AlertModal, {
  ssr: false,
});

interface InnerManagePenalCodeGroupsPageProps {
  groups: { groups: PenalCodeGroup[]; totalCount: number };
}

export function InnerManagePenalCodeGroupsPage(props: InnerManagePenalCodeGroupsPageProps) {
  const t = useTranslations("PENAL_CODE_GROUP");
  const common = useTranslations("Common");
  const { openModal, closeModal } = useModal();
  const { execute, state } = useFetch();
  const router = useRouter();

  const ungroupedGroup = {
    id: "ungrouped",
    name: t("ungrouped"),
  } as PenalCodeGroup;

  const initialGroups = React.useMemo(() => {
    return [ungroupedGroup, ...props.groups.groups];
  }, [props.groups.groups]); // eslint-disable-line react-hooks/exhaustive-deps

  const [search, setSearch] = React.useState("");

  const asyncTable = useAsyncTable({
    fetchOptions: {
      onResponse: (json: InnerManagePenalCodeGroupsPageProps["groups"]) => ({
        data: [ungroupedGroup, ...json.groups],
        totalCount: json.totalCount + 1,
      }),
      path: "/admin/penal-code-group",
      requireFilterText: true,
    },
    initialData: initialGroups,
    totalCount: props.groups.totalCount + 1,
    search,
  });

  const tableState = useTableState({
    dragDrop: {
      onListChange,
      disabledIndices: [asyncTable.items.findIndex((v) => v.id === "ungrouped")],
    },
    pagination: asyncTable.pagination,
  });
  const [tempGroup, groupState] = useTemporaryItem(asyncTable.items);

  async function onListChange(list: PenalCodeGroup[]) {
    if (!hasTableDataChanged(asyncTable.items, list)) return;

    for (const [index, value] of list.entries()) {
      value.position = index;

      asyncTable.move(value.id, index);
      asyncTable.update(value.id, value);
    }

    await execute<PutValuePositionsData>({
      path: "/admin/values/penal_code_group/positions",
      method: "PUT",
      data: {
        ids: list.filter((v) => v.id !== "ungrouped").map((v) => v.id),
      },
    });
  }

  function handleEditGroup(groupId: string) {
    groupState.setTempId(groupId);
    openModal(ModalIds.ManagePenalCodeGroup);
  }

  function handleDeleteGroupClick(groupId: string) {
    groupState.setTempId(groupId);
    openModal(ModalIds.AlertDeleteGroup);
  }

  async function handleDeleteGroup() {
    if (!tempGroup) return;

    const { json } = await execute<DeletePenalCodeGroupsData>({
      path: `/admin/penal-code-group/${tempGroup.id}`,
      method: "DELETE",
    });

    if (json) {
      asyncTable.remove(tempGroup.id);
      groupState.setTempId(null);
      closeModal(ModalIds.AlertDeleteGroup);
    }
  }

  return (
    <>
      <header className="flex items-center justify-between">
        <div>
          <Title className="!mb-0">{t("MANAGE")}</Title>
          <Link
            className="mt-1 underline flex items-center gap-1 text-blue-500"
            target="_blank"
            href={createValueDocumentationURL(ValueType.PENAL_CODE)}
          >
            {common("learnMore")}
            <BoxArrowUpRight className="inline-block" />
          </Link>
        </div>

        <div className="flex gap-2">
          <Button onPress={() => openModal(ModalIds.ManagePenalCodeGroup)}>{t("ADD")}</Button>
          {/* values is set to non-empty array */}
          <OptionsDropdown type={ValueType.PENAL_CODE} valueLength={asyncTable.items.length} />
        </div>
      </header>

      <SearchArea
        search={{ search, setSearch }}
        asyncTable={asyncTable}
        totalCount={props.groups.totalCount}
      />

      <Table
        features={{ dragAndDrop: true }}
        tableState={tableState}
        data={asyncTable.items.map((group) => ({
          id: group.id,
          rowProps: { value: group },
          value: group.name,
          actions: (
            <>
              <Link
                className={classNames("rounded-md", buttonSizes.xs, buttonVariants.default)}
                href={`/admin/values/penal-code/${group.id}`}
              >
                {common("view")}
              </Link>
              {group.id !== "ungrouped" ? (
                <>
                  <Button
                    className="ml-2"
                    onPress={() => handleEditGroup(group.id)}
                    size="xs"
                    variant="success"
                    disabled={group.id === "ungrouped"}
                  >
                    {common("edit")}
                  </Button>
                  <Button
                    className="ml-2"
                    onPress={() => handleDeleteGroupClick(group.id)}
                    size="xs"
                    variant="danger"
                    disabled={group.id === "ungrouped"}
                  >
                    {common("delete")}
                  </Button>
                </>
              ) : null}
            </>
          ),
        }))}
        columns={[
          { header: common("name"), accessorKey: "value" },
          { header: common("actions"), accessorKey: "actions" },
        ]}
      />

      <ManagePenalCodeGroup
        onUpdate={(previousGroup, newGroup) => {
          asyncTable.update(previousGroup.id, newGroup);
          groupState.setTempId(null);
        }}
        onCreate={(group) => asyncTable.append(group)}
        onClose={() => groupState.setTempId(null)}
        group={tempGroup}
      />

      <AlertModal
        id={ModalIds.AlertDeleteGroup}
        description={t.rich("alert_deletePenalCodeGroup", {
          span: (children) => <span className="font-bold">{children}</span>,
          group: tempGroup?.name ?? "",
        })}
        onDeleteClick={handleDeleteGroup}
        title={t("deleteGroup")}
        state={state}
      />

      <ImportValuesModal onImport={() => router.refresh()} type={ValueType.PENAL_CODE} />
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
