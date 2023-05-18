"use client";

import * as React from "react";
import { GetImportWeaponsData, PostImportWeaponsData } from "@snailycad/types/api";
import { useTranslations } from "use-intl";
import { useModal } from "~/state/modalState";
import { Permissions, usePermission } from "~/hooks/usePermission";
import useFetch from "~/lib/useFetch";
import { Table, useAsyncTable, useTableState } from "~/components/shared/Table";
import { useTemporaryItem } from "~/hooks/shared/useTemporaryItem";
import { Weapon } from "@snailycad/types";
import { ModalIds } from "~/types/ModalIds";
import { Title } from "~/components/shared/Title";
import { Button } from "@snailycad/ui";
import { SearchArea } from "~/components/shared/search/search-area";
import { FullDate } from "~/components/shared/FullDate";
import { ImportModal } from "~/components/admin/import/ImportModal";
import { AlertModal } from "~/components/modal/AlertModal";

interface InnerImportWeaponsPageProps {
  defaultData: GetImportWeaponsData;
}

export function InnerImportWeaponsPage(props: InnerImportWeaponsPageProps) {
  const [search, setSearch] = React.useState("");

  const t = useTranslations("Management");
  const common = useTranslations("Common");
  const wep = useTranslations("Weapons");
  const { closeModal, openModal } = useModal();
  const { state, execute } = useFetch();
  const { hasPermissions } = usePermission();
  const hasDeletePermissions = hasPermissions([Permissions.DeleteRegisteredWeapons]);

  const asyncTable = useAsyncTable({
    search,
    fetchOptions: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onResponse: (json: GetImportWeaponsData) => ({
        totalCount: json.totalCount,
        data: json.weapons,
      }),
      path: "/admin/import/weapons",
    },
    initialData: props.defaultData.weapons,
    totalCount: props.defaultData.totalCount,
  });
  const tableState = useTableState({ pagination: asyncTable.pagination });
  const [tempWeapon, weaponState] = useTemporaryItem(asyncTable.items);

  function handleDeleteClick(weapon: Weapon) {
    weaponState.setTempId(weapon.id);
    openModal(ModalIds.AlertDeleteWeapon);
  }

  async function handleDeleteWeapon() {
    if (!tempWeapon) return;

    const { json } = await execute({
      path: `/admin/import/weapons/${tempWeapon.id}`,
      method: "DELETE",
    });

    if (typeof json === "boolean" && json) {
      asyncTable.remove(tempWeapon.id);
      weaponState.setTempId(null);
      closeModal(ModalIds.AlertDeleteWeapon);
    }
  }

  return (
    <>
      <header>
        <div className="flex items-center justify-between">
          <Title className="!mb-0">{t("IMPORT_WEAPONS")}</Title>

          <div>
            <Button onPress={() => openModal(ModalIds.ImportWeapons)}>{t("importViaFile")}</Button>
          </div>
        </div>

        <p className="my-2 mt-5 text-neutral-700 dark:text-gray-400 max-w-2xl">
          {t("importWeaponsDescription")}
        </p>
      </header>

      <SearchArea
        search={{ search, setSearch }}
        asyncTable={asyncTable}
        totalCount={props.defaultData.totalCount}
      />

      <Table
        tableState={tableState}
        data={asyncTable.items.map((weapon) => ({
          id: weapon.id,
          model: weapon.model.value.value,
          registrationStatus: weapon.registrationStatus.value,
          serialNumber: weapon.serialNumber,
          citizen: `${weapon.citizen.name} ${weapon.citizen.surname}`,
          createdAt: <FullDate>{weapon.createdAt}</FullDate>,
          actions: (
            <Button size="xs" variant="danger" onPress={() => handleDeleteClick(weapon)}>
              {common("delete")}
            </Button>
          ),
        }))}
        columns={[
          { header: wep("model"), accessorKey: "model" },
          { header: wep("registrationStatus"), accessorKey: "registrationStatus" },
          { header: wep("serialNumber"), accessorKey: "serialNumber" },
          { header: common("citizen"), accessorKey: "citizen" },
          { header: common("createdAt"), accessorKey: "createdAt" },
          hasDeletePermissions ? { header: common("actions"), accessorKey: "actions" } : null,
        ]}
      />

      <ImportModal<PostImportWeaponsData>
        onImport={(weapons) => asyncTable.append(...weapons)}
        id={ModalIds.ImportWeapons}
        url="/admin/import/weapons/file"
      />

      {hasDeletePermissions ? (
        <AlertModal
          id={ModalIds.AlertDeleteWeapon}
          title="Delete weapon"
          description={`Are you sure you want to delete this weapon (${tempWeapon?.serialNumber})? This action cannot be undone.`}
          onDeleteClick={handleDeleteWeapon}
          state={state}
        />
      ) : null}
    </>
  );
}
