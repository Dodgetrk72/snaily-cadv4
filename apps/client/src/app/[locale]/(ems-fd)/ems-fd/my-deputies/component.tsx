"use client";

import { ValueType } from "@snailycad/types";
import { DeleteMyDeputyByIdData, GetMyDeputiesData } from "@snailycad/types/api";
import { Button } from "@snailycad/ui";
import dynamic from "next/dynamic";
import { useTranslations } from "use-intl";
import { OfficerRank } from "~/components/leo/OfficerRank";
import { UnitDepartmentStatus } from "~/components/leo/UnitDepartmentStatus";
import { Table, useAsyncTable, useTableState } from "~/components/shared/Table";
import { Title } from "~/components/shared/Title";
import { ImageWrapper } from "~/components/shared/image-wrapper";
import { useTemporaryItem } from "~/hooks/shared/useTemporaryItem";
import { useFeatureEnabled } from "~/hooks/use-feature-enabled";
import { useGenerateCallsign } from "~/hooks/useGenerateCallsign";
import { useImageUrl } from "~/hooks/useImageUrl";
import { useLoadValuesClientSide } from "~/hooks/useLoadValuesClientSide";
import useFetch from "~/lib/useFetch";
import { formatOfficerDepartment, makeUnitName } from "~/lib/utils";
import { useModal } from "~/state/modalState";
import { ModalIds } from "~/types/ModalIds";

interface InnerMyDeputiesPageProps {
  defaultData: GetMyDeputiesData;
}

const AlertModal = dynamic(async () => (await import("~/components/modal/AlertModal")).AlertModal);
const ManageDeputyModal = dynamic(
  async () => (await import("~/components/ems-fd/modals/ManageDeputyModal")).ManageDeputyModal,
);

export function InnerMyDeputiesPage(props: InnerMyDeputiesPageProps) {
  useLoadValuesClientSide({
    valueTypes: [ValueType.DEPARTMENT, ValueType.DIVISION],
  });

  const common = useTranslations("Common");
  const t = useTranslations();
  const { openModal, closeModal } = useModal();
  const { state, execute } = useFetch();
  const { generateCallsign } = useGenerateCallsign();
  const { makeImageUrl } = useImageUrl();
  const { DIVISIONS, BADGE_NUMBERS } = useFeatureEnabled();
  const tableState = useTableState();

  const asyncTable = useAsyncTable({
    initialData: props.defaultData.deputies,
    totalCount: props.defaultData.totalCount,
    fetchOptions: {
      path: "/ems-fd",
      onResponse(json: GetMyDeputiesData) {
        return { data: json.deputies, totalCount: json.totalCount };
      },
    },
  });

  const [tempDeputy, deputyState] = useTemporaryItem(asyncTable.items);

  async function handleDeleteDeputy() {
    if (!tempDeputy) return;

    const { json } = await execute<DeleteMyDeputyByIdData>({
      path: `/ems-fd/${tempDeputy.id}`,
      method: "DELETE",
    });

    if (json) {
      closeModal(ModalIds.AlertDeleteDeputy);

      asyncTable.remove(tempDeputy.id);
      deputyState.setTempId(null);
    }
  }

  function handleEditClick(deputy: GetMyDeputiesData["deputies"][number]) {
    deputyState.setTempId(deputy.id);
    openModal(ModalIds.ManageDeputy);
  }

  function handleDeleteClick(deputy: GetMyDeputiesData["deputies"][number]) {
    deputyState.setTempId(deputy.id);
    openModal(ModalIds.AlertDeleteDeputy);
  }

  return (
    <>
      <header className="flex items-center justify-between">
        <Title className="!mb-0">{t("Ems.myDeputies")}</Title>

        <Button onPress={() => openModal(ModalIds.ManageDeputy)}>{t("Ems.createDeputy")}</Button>
      </header>

      {asyncTable.totalCount <= 0 ? (
        <p className="mt-5">{t("Ems.noDeputies")}</p>
      ) : (
        <Table
          tableState={tableState}
          data={asyncTable.items.map((deputy) => ({
            id: deputy.id,
            deputy: (
              <span className="flex items-center">
                {deputy.imageId ? (
                  <ImageWrapper
                    quality={70}
                    className="rounded-md w-[30px] h-[30px] object-cover mr-2"
                    draggable={false}
                    src={makeImageUrl("units", deputy.imageId)!}
                    loading="lazy"
                    width={30}
                    height={30}
                    alt={makeUnitName(deputy)}
                  />
                ) : null}
                {makeUnitName(deputy)}
              </span>
            ),
            callsign: generateCallsign(deputy),
            badgeNumber: deputy.badgeNumber,
            department: formatOfficerDepartment(deputy) ?? common("none"),
            departmentStatus: <UnitDepartmentStatus unit={deputy} />,
            division: deputy.division?.value.value ?? common("none"),
            rank: <OfficerRank unit={deputy} />,
            position: deputy.position ?? common("none"),
            actions: (
              <>
                <Button size="xs" onPress={() => handleEditClick(deputy)} variant="success">
                  {common("edit")}
                </Button>
                <Button
                  onPress={() => handleDeleteClick(deputy)}
                  className="ml-2"
                  variant="danger"
                  size="xs"
                >
                  {common("delete")}
                </Button>
              </>
            ),
          }))}
          columns={[
            { header: t("Ems.deputy"), accessorKey: "deputy" },
            { header: t("Leo.callsign"), accessorKey: "callsign" },
            BADGE_NUMBERS ? { header: t("Leo.badgeNumber"), accessorKey: "badgeNumber" } : null,
            { header: t("Leo.department"), accessorKey: "department" },
            DIVISIONS ? { header: t("Leo.division"), accessorKey: "division" } : null,
            { header: t("Leo.rank"), accessorKey: "rank" },
            { header: t("Leo.position"), accessorKey: "position" },
            { header: t("Leo.status"), accessorKey: "departmentStatus" },
            { header: common("actions"), accessorKey: "actions" },
          ]}
        />
      )}

      <ManageDeputyModal
        onCreate={(deputy) => asyncTable.prepend(deputy)}
        onUpdate={(previousDeputy, updatedDeputy) => {
          asyncTable.update(previousDeputy.id, updatedDeputy);
        }}
        deputy={tempDeputy}
        onClose={() => deputyState.setTempId(null)}
      />

      <AlertModal
        title={t("Ems.deleteDeputy")}
        description={t.rich("Ems.alert_deleteDeputy", {
          deputy: tempDeputy && makeUnitName(tempDeputy),
          span: (children) => <span className="font-semibold">{children}</span>,
        })}
        id={ModalIds.AlertDeleteDeputy}
        onDeleteClick={handleDeleteDeputy}
        onClose={() => deputyState.setTempId(null)}
        state={state}
      />
    </>
  );
}
