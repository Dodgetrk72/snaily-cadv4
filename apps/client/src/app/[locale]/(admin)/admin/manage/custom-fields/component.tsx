"use client";

import * as React from "react";
import { DeleteManageCustomFieldsData, GetManageCustomFieldsData } from "@snailycad/types/api";
import { useTranslations } from "use-intl";
import { Table, useAsyncTable, useTableState } from "~/components/shared/Table";
import { Permissions, usePermission } from "~/hooks/usePermission";
import useFetch from "~/lib/useFetch";
import { useModal } from "~/state/modalState";
import { SearchArea } from "~/components/shared/search/search-area";
import { Button } from "@snailycad/ui";
import { ModalIds } from "~/types/ModalIds";
import { Title } from "~/components/shared/Title";
import { useTemporaryItem } from "~/hooks/shared/useTemporaryItem";
import { AlertModal } from "~/components/modal/AlertModal";
import { ManageCustomFieldModal } from "~/components/admin/manage/custom-fields/ManageCustomFieldModal";
import { CustomField } from "@snailycad/types";

interface InnerManageCustomFieldsPageProps {
  defaultData: GetManageCustomFieldsData;
}

export function InnerManageCustomFieldsPage(props: InnerManageCustomFieldsPageProps) {
  const { state, execute } = useFetch();
  const { hasPermissions } = usePermission();
  const { openModal, closeModal } = useModal();
  const t = useTranslations("Management");
  const common = useTranslations("Common");
  const hasManagePermissions = hasPermissions([Permissions.ManageCustomFields]);

  const [search, setSearch] = React.useState("");

  const asyncTable = useAsyncTable({
    fetchOptions: {
      onResponse: (data: GetManageCustomFieldsData) => ({
        data: data.customFields,
        totalCount: data.totalCount,
      }),
      path: "/admin/manage/custom-fields",
    },
    search,
    totalCount: props.defaultData.totalCount,
    initialData: props.defaultData.customFields,
  });
  const [tempField, tempFieldState] = useTemporaryItem(asyncTable.items);
  const tableState = useTableState({
    pagination: asyncTable.pagination,
  });

  async function handleDelete() {
    if (!tempField) return;

    const { json } = await execute<DeleteManageCustomFieldsData>({
      path: `/admin/manage/custom-fields/${tempField.id}`,
      method: "DELETE",
    });

    if (typeof json === "boolean" && json) {
      asyncTable.remove(tempField.id);
      tempFieldState.setTempId(null);
      closeModal(ModalIds.AlertDeleteCustomField);
    }
  }

  function handleEditClick(field: CustomField) {
    tempFieldState.setTempId(field.id);
    openModal(ModalIds.ManageCustomField);
  }

  function handleDeleteClick(field: CustomField) {
    tempFieldState.setTempId(field.id);
    openModal(ModalIds.AlertDeleteCustomField);
  }

  return (
    <>
      <header className="flex items-start justify-between mb-5">
        <div className="flex flex-col">
          <Title className="!mb-0">{t("MANAGE_CUSTOM_FIELDS")}</Title>

          <p className="max-w-2xl mt-2 text-neutral-700 dark:text-gray-400">
            {t("manageCustomFieldsDescription")}
          </p>
        </div>

        {hasManagePermissions ? (
          <div>
            <Button onPress={() => openModal(ModalIds.ManageCustomField)}>
              {t("createCustomField")}
            </Button>
          </div>
        ) : null}
      </header>

      <SearchArea
        asyncTable={asyncTable}
        search={{ search, setSearch }}
        totalCount={props.defaultData.totalCount}
      />

      {asyncTable.noItemsAvailable ? (
        <p className="text-neutral-700 dark:text-gray-400 mt-3">{t("noCustomFields")}</p>
      ) : (
        <Table
          tableState={tableState}
          data={asyncTable.items.map((field) => ({
            id: field.id,
            name: field.name,
            category: field.category,
            actions: (
              <>
                <Button size="xs" variant="success" onPress={() => handleEditClick(field)}>
                  {common("edit")}
                </Button>
                <Button
                  className="ml-2"
                  size="xs"
                  variant="danger"
                  onPress={() => handleDeleteClick(field)}
                >
                  {common("delete")}
                </Button>
              </>
            ),
          }))}
          columns={[
            { header: common("name"), accessorKey: "name" },
            { header: "Category", accessorKey: "category" },
            hasManagePermissions ? { header: common("actions"), accessorKey: "actions" } : null,
          ]}
        />
      )}

      <ManageCustomFieldModal
        onUpdate={(newField) => {
          asyncTable.update(newField.id, newField);
          tempFieldState.setTempId(null);
        }}
        onCreate={(newField) => asyncTable.prepend(newField)}
        onClose={() => tempFieldState.setTempId(null)}
        field={tempField}
      />
      <AlertModal
        id={ModalIds.AlertDeleteCustomField}
        title={t("deleteCustomField")}
        description={t("alert_deleteCustomField")}
        onDeleteClick={handleDelete}
        onClose={() => tempFieldState.setTempId(null)}
        state={state}
      />
    </>
  );
}
