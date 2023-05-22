"use client";

import * as React from "react";
import { GetManageUnitByIdData } from "@snailycad/types/api";
import { useTranslations } from "use-intl";
import { ValueType } from "@snailycad/types";
import { BreadcrumbItem, Breadcrumbs } from "@snailycad/ui";
import { Title } from "~/components/shared/Title";

import { ManageUnitTab } from "~/components/admin/manage/units/tabs/manage-unit-tab/manage-unit-tab";
import { useLoadValuesClientSide } from "~/hooks/useLoadValuesClientSide";
import { useGenerateCallsign } from "~/hooks/useGenerateCallsign";
import { makeUnitName } from "~/lib/utils";

interface InnerManageUnitByIdPageProps {
  unit: GetManageUnitByIdData;
}

export function InnerManageUnitByIdPage(props: InnerManageUnitByIdPageProps) {
  useLoadValuesClientSide({
    valueTypes: [
      ValueType.QUALIFICATION,
      ValueType.CODES_10,
      ValueType.DEPARTMENT,
      ValueType.DIVISION,
      ValueType.OFFICER_RANK,
    ],
  });

  const { generateCallsign } = useGenerateCallsign();
  const tAdmin = useTranslations("Management");

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem href="/admin/manage/units">{tAdmin("MANAGE_UNITS")}</BreadcrumbItem>
        <BreadcrumbItem>{tAdmin("editUnit")}</BreadcrumbItem>
        <BreadcrumbItem>
          {generateCallsign(props.unit)} {makeUnitName(props.unit)}
        </BreadcrumbItem>
      </Breadcrumbs>

      <Title renderLayoutTitle={false} className="mb-2">
        {tAdmin("editUnit")}
      </Title>

      <ManageUnitTab unit={props.unit} />
    </>
  );
}
