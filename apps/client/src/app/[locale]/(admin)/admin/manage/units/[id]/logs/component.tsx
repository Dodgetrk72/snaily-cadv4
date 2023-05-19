"use client";

import * as React from "react";
import { GetManageUnitByIdData } from "@snailycad/types/api";
import { useTranslations } from "use-intl";
import { ValueType } from "@snailycad/types";
import { BreadcrumbItem, Breadcrumbs } from "@snailycad/ui";
import { Title } from "~/components/shared/Title";

import { useLoadValuesClientSide } from "~/hooks/useLoadValuesClientSide";
import { useGenerateCallsign } from "~/hooks/useGenerateCallsign";
import { makeUnitName } from "~/lib/utils";
import { UnitLogsTab } from "~/components/admin/manage/units/tabs/manage-unit-tab/unit-logs-tab";

interface InnerManageUnitByIdPageLogsTabProps {
  unit: GetManageUnitByIdData;
}

export function InnerManageUnitByIdPageLogsTab(props: InnerManageUnitByIdPageLogsTabProps) {
  useLoadValuesClientSide({ valueTypes: [ValueType.QUALIFICATION] });

  const { generateCallsign } = useGenerateCallsign();
  const t = useTranslations("Management");

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem href="/admin/manage/units">{t("MANAGE_UNITS")}</BreadcrumbItem>
        <BreadcrumbItem>{t("editUnit")}</BreadcrumbItem>
        <BreadcrumbItem>
          {generateCallsign(props.unit)} {makeUnitName(props.unit)}
        </BreadcrumbItem>
      </Breadcrumbs>

      <Title renderLayoutTitle={false} className="mb-2">
        {t("editUnit")}
      </Title>

      <UnitLogsTab unit={props.unit} />
    </>
  );
}
