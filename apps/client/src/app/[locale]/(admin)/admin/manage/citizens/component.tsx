"use client";

import * as React from "react";
import { GetManageCitizensData } from "@snailycad/types/api";
import { useTranslations } from "use-intl";
import { Title } from "~/components/shared/Title";

import { AllCitizensTab } from "~/components/admin/manage/citizens/all-citizens-tab";

interface InnerManageCitizenByIdPageProps {
  defaultData: GetManageCitizensData;
}

export function InnerManageCitizenByIdPage(props: InnerManageCitizenByIdPageProps) {
  const t = useTranslations("Management");

  return (
    <>
      <Title>{t("MANAGE_CITIZENS")}</Title>

      <AllCitizensTab
        totalCount={props.defaultData.totalCount}
        citizens={props.defaultData.citizens}
      />
    </>
  );
}
