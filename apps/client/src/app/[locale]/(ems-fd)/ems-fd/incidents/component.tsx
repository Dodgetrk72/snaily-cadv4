"use client";

import * as React from "react";
import { useEmsFdState } from "~/state/ems-fd-state";
import { getEMsFdIncidentsData } from "./page";
import { useModal } from "~/state/modalState";
import { useTranslations } from "use-intl";
import { Permissions, usePermission } from "~/hooks/usePermission";
import { Title } from "~/components/shared/Title";
import { ModalIds } from "~/types/ModalIds";
import { Button } from "@snailycad/ui";
import { IncidentsTable } from "~/components/leo/incidents/incidents-table";

interface InnerEmsFdIncidentsPageProps {
  data: Awaited<ReturnType<typeof getEMsFdIncidentsData>>;
}

export function InnerEmsFdIncidentsPage(props: InnerEmsFdIncidentsPageProps) {
  const t = useTranslations("Leo");
  const { openModal } = useModal();
  const setActiveDeputy = useEmsFdState((state) => state.setActiveDeputy);

  const { hasPermissions } = usePermission();
  const activeDeputy = props.data.activeDeputy ?? null;

  const isDeputyOnDuty =
    (activeDeputy && activeDeputy.status?.shouldDo !== "SET_OFF_DUTY") ?? false;

  React.useEffect(() => {
    setActiveDeputy(activeDeputy);
  }, [setActiveDeputy, activeDeputy]);

  return (
    <>
      <header className="flex items-center justify-between">
        <Title className="!mb-0">{t("incidents")}</Title>

        {hasPermissions([Permissions.ManageEmsFdIncidents]) ? (
          <Button
            title={!isDeputyOnDuty ? "You must have an active ems/fd deputy." : ""}
            disabled={!isDeputyOnDuty}
            onPress={() => openModal(ModalIds.ManageIncident)}
          >
            {t("createIncident")}
          </Button>
        ) : null}
      </header>

      <IncidentsTable
        initialData={props.data.incidents}
        isUnitOnDuty={isDeputyOnDuty}
        type="ems-fd"
      />
    </>
  );
}
