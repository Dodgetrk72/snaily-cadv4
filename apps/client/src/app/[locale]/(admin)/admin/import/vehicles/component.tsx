"use client";

import * as React from "react";
import { GetImportVehiclesData, PostImportVehiclesData } from "@snailycad/types/api";
import { useTranslations } from "use-intl";
import { useModal } from "~/state/modalState";
import { Permissions, usePermission } from "~/hooks/usePermission";
import useFetch from "~/lib/useFetch";
import { Table, useAsyncTable, useTableState } from "~/components/shared/Table";
import { useTemporaryItem } from "~/hooks/shared/useTemporaryItem";
import { RegisteredVehicle } from "@snailycad/types";
import { ModalIds } from "~/types/ModalIds";
import { Title } from "~/components/shared/Title";
import { Button } from "@snailycad/ui";
import { SearchArea } from "~/components/shared/search/search-area";
import { FullDate } from "~/components/shared/FullDate";
import { ImportModal } from "~/components/admin/import/ImportModal";
import { AlertModal } from "~/components/modal/AlertModal";

interface InnerImportVehiclesPageProps {
  defaultData: GetImportVehiclesData;
}

export function InnerImportVehiclesPage(props: InnerImportVehiclesPageProps) {
  const [search, setSearch] = React.useState("");

  const t = useTranslations("Management");
  const common = useTranslations("Common");
  const veh = useTranslations("Vehicles");
  const { closeModal, openModal } = useModal();
  const { state, execute } = useFetch();
  const { hasPermissions } = usePermission();
  const hasDeletePermissions = hasPermissions([Permissions.DeleteRegisteredVehicles]);

  const asyncTable = useAsyncTable({
    search,
    fetchOptions: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onResponse: (json: GetImportVehiclesData) => ({
        totalCount: json.totalCount,
        data: json.vehicles,
      }),
      path: "/admin/import/vehicles",
    },
    initialData: props.defaultData.vehicles,
    totalCount: props.defaultData.totalCount,
  });
  const tableState = useTableState({ pagination: asyncTable.pagination });
  const [tempVehicle, vehicleState] = useTemporaryItem(asyncTable.items);

  function handleDeleteClick(vehicle: RegisteredVehicle) {
    vehicleState.setTempId(vehicle.id);
    openModal(ModalIds.AlertDeleteVehicle);
  }

  async function handleDeleteVehicle() {
    if (!tempVehicle) return;

    const { json } = await execute({
      path: `/admin/import/vehicles/${tempVehicle.id}`,
      method: "DELETE",
    });

    if (typeof json === "boolean" && json) {
      asyncTable.remove(tempVehicle.id);
      vehicleState.setTempId(null);
      closeModal(ModalIds.AlertDeleteVehicle);
    }
  }

  return (
    <>
      <header>
        <div className="flex items-center justify-between">
          <Title className="!mb-0">{t("IMPORT_VEHICLES")}</Title>

          <div>
            <Button onPress={() => openModal(ModalIds.ImportVehicles)}>{t("importViaFile")}</Button>
          </div>
        </div>

        <p className="my-2 mt-5 text-neutral-700 dark:text-gray-400 max-w-2xl">
          {t("importVehiclesDescription")}
        </p>
      </header>

      <SearchArea
        search={{ search, setSearch }}
        asyncTable={asyncTable}
        totalCount={props.defaultData.totalCount}
      />

      <Table
        tableState={tableState}
        data={asyncTable.items.map((vehicle) => ({
          id: vehicle.id,
          plate: vehicle.plate,
          model: vehicle.model.value.value,
          color: vehicle.color,
          registrationStatus: vehicle.registrationStatus.value,
          vinNumber: vehicle.vinNumber,
          citizen: vehicle.citizen
            ? `${vehicle.citizen.name} ${vehicle.citizen.surname}`
            : common("unknown"),
          createdAt: <FullDate>{vehicle.createdAt}</FullDate>,
          actions: (
            <Button size="xs" variant="danger" onPress={() => handleDeleteClick(vehicle)}>
              {common("delete")}
            </Button>
          ),
        }))}
        columns={[
          { header: veh("plate"), accessorKey: "plate" },
          { header: veh("model"), accessorKey: "model" },
          { header: veh("color"), accessorKey: "color" },
          { header: veh("registrationStatus"), accessorKey: "registrationStatus" },
          { header: veh("vinNumber"), accessorKey: "vinNumber" },
          { header: common("citizen"), accessorKey: "citizen" },
          { header: common("createdAt"), accessorKey: "createdAt" },
          hasDeletePermissions ? { header: common("actions"), accessorKey: "actions" } : null,
        ]}
      />

      <ImportModal<PostImportVehiclesData>
        onImport={(vehicles) => asyncTable.append(...vehicles)}
        id={ModalIds.ImportVehicles}
        url="/admin/import/vehicles/file"
      />

      {hasDeletePermissions ? (
        <AlertModal
          id={ModalIds.AlertDeleteVehicle}
          title="Delete vehicle"
          description={`Are you sure you want to delete this vehicle (${tempVehicle?.plate})? This action cannot be undone.`}
          onDeleteClick={handleDeleteVehicle}
          state={state}
        />
      ) : null}
    </>
  );
}
