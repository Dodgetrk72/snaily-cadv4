"use client";

import { Citizen } from "@snailycad/types";
import { GetDeadCitizensData, PostEmsFdDeclareCitizenById } from "@snailycad/types/api";
import { Button } from "@snailycad/ui";
import { useTranslations } from "use-intl";
import { AlertModal } from "~/components/modal/AlertModal";
import { FullDate } from "~/components/shared/FullDate";
import { Table, useAsyncTable, useTableState } from "~/components/shared/Table";
import { Title } from "~/components/shared/Title";
import { useTemporaryItem } from "~/hooks/shared/useTemporaryItem";
import { Permissions, usePermission } from "~/hooks/usePermission";
import { toastMessage } from "~/lib/toastMessage";
import useFetch from "~/lib/useFetch";
import { useModal } from "~/state/modalState";
import { ModalIds } from "~/types/ModalIds";

interface InnerHospitalServicesPageProps {
  defaultData: GetDeadCitizensData;
}

export function InnerHospitalServicesPage(props: InnerHospitalServicesPageProps) {
  const t = useTranslations();
  const common = useTranslations("Common");

  const { state, execute } = useFetch();
  const { openModal, closeModal } = useModal();
  const { hasPermissions } = usePermission();
  const hasMangeDeadCitizensPermissions = hasPermissions([Permissions.ManageDeadCitizens]);

  async function handleDeclareCitizenAlive() {
    if (!tempCitizen) return;

    const { json } = await execute<PostEmsFdDeclareCitizenById>({
      path: `/ems-fd/declare/${tempCitizen.id}`,
      method: "POST",
    });

    if (json) {
      toastMessage({
        icon: "success",
        title: t("HospitalServices.citizenDeclaredAlive"),
        message: t("HospitalServices.citizenDeclaredAliveMessage", {
          name: `${tempCitizen.name} ${tempCitizen.surname}`,
        }),
      });
      closeModal(ModalIds.AlertDeclareCitizenAlive);
      tempCitizenState.setTempId(null);
    }
  }

  function handleDeclareCitizenAliveClick(citizenId: string) {
    tempCitizenState.setTempId(citizenId);
    openModal(ModalIds.AlertDeclareCitizenAlive);
  }

  const asyncTable = useAsyncTable<Citizen>({
    fetchOptions: {
      onResponse: (data: GetDeadCitizensData) => ({
        data: data.citizens,
        totalCount: data.totalCount,
      }),
      path: "/ems-fd/dead-citizens",
    },
    initialData: props.defaultData.citizens,
    totalCount: props.defaultData.totalCount,
  });
  const tableState = useTableState(asyncTable);
  const [tempCitizen, tempCitizenState] = useTemporaryItem(asyncTable.items);

  return (
    <>
      <Title className="mb-3">{t("HospitalServices.hospitalServices")}</Title>

      {asyncTable.items.length <= 0 ? (
        <p>{t("HospitalServices.noDeadCitizens")}</p>
      ) : (
        <Table
          tableState={tableState}
          data={asyncTable.items.map((citizen) => ({
            id: citizen.id,
            name: `${citizen.name} ${citizen.surname}`,
            dateOfBirth: (
              <FullDate isDateOfBirth onlyDate>
                {citizen.dateOfBirth}
              </FullDate>
            ),
            gender: citizen.gender?.value ?? common("none"),
            ethnicity: citizen.ethnicity?.value ?? common("none"),
            hairColor: citizen.hairColor,
            eyeColor: citizen.eyeColor,
            weight: citizen.weight,
            height: citizen.height,
            actions: (
              <Button
                onClick={() => handleDeclareCitizenAliveClick(citizen.id)}
                variant="success"
                size="xs"
              >
                {t("HospitalServices.declareAlive")}
              </Button>
            ),
          }))}
          columns={[
            { header: t("Citizen.fullName"), accessorKey: "name" },
            { header: t("Citizen.dateOfBirth"), accessorKey: "dateOfBirth" },
            { header: t("Citizen.gender"), accessorKey: "gender" },
            { header: t("Citizen.ethnicity"), accessorKey: "ethnicity" },
            { header: t("Citizen.hairColor"), accessorKey: "hairColor" },
            { header: t("Citizen.eyeColor"), accessorKey: "eyeColor" },
            { header: t("Citizen.weight"), accessorKey: "weight" },
            { header: t("Citizen.height"), accessorKey: "height" },
            hasMangeDeadCitizensPermissions
              ? { header: common("actions"), accessorKey: "actions" }
              : null,
          ]}
        />
      )}

      {hasMangeDeadCitizensPermissions ? (
        <AlertModal
          title={t("HospitalServices.declareAlive")}
          description={t.rich("HospitalServices.alert_declareAlive", {
            citizen: `${tempCitizen?.name} ${tempCitizen?.surname}`,
            span: (children) => <span className="font-semibold">{children}</span>,
          })}
          id={ModalIds.AlertDeclareCitizenAlive}
          state={state}
          onDeleteClick={handleDeclareCitizenAlive}
          deleteText={t("HospitalServices.declareAlive")}
        />
      ) : null}
    </>
  );
}
