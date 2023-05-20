"use client";

import * as React from "react";
import {
  GetManageCitizenByIdData,
  PostCitizenImageByIdData,
  PutManageCitizenByIdData,
} from "@snailycad/types/api";
import useFetch from "~/lib/useFetch";
import { useTranslations } from "use-intl";
import { ValueType } from "@snailycad/types";
import { BreadcrumbItem, Breadcrumbs, SelectValue } from "@snailycad/ui";
import { Title } from "~/components/shared/Title";

import { useRouter } from "next/navigation";
import { useLoadValuesClientSide } from "~/hooks/useLoadValuesClientSide";
import { ManageCitizenForm } from "~/components/citizen/manage-citizen-form";

interface InnerManageCitizenByIdPageProps {
  citizen: NonNullable<GetManageCitizenByIdData>;
}

export function InnerManageCitizenByIdPage(props: InnerManageCitizenByIdPageProps) {
  const t = useTranslations();
  const { state, execute } = useFetch();
  const router = useRouter();
  useLoadValuesClientSide({
    valueTypes: [ValueType.GENDER, ValueType.ETHNICITY, ValueType.LICENSE],
  });

  async function handleSubmit({
    data,
    helpers,
    formData,
  }: {
    data: any;
    formData?: FormData;
    helpers: any;
  }) {
    const { json, error } = await execute<PutManageCitizenByIdData>({
      path: `/admin/manage/citizens/${props.citizen.id}`,
      method: "PUT",
      helpers,
      data: {
        ...data,
        driversLicenseCategory: Array.isArray(data.driversLicenseCategory)
          ? (data.driversLicenseCategory as SelectValue[]).map((v) => v.value)
          : data.driversLicenseCategory,
        pilotLicenseCategory: Array.isArray(data.pilotLicenseCategory)
          ? (data.pilotLicenseCategory as SelectValue[]).map((v) => v.value)
          : data.pilotLicenseCategory,
        waterLicenseCategory: Array.isArray(data.waterLicenseCategory)
          ? (data.waterLicenseCategory as SelectValue[]).map((v) => v.value)
          : data.waterLicenseCategory,
        firearmLicenseCategory: Array.isArray(data.firearmLicenseCategory)
          ? (data.firearmLicenseCategory as SelectValue[]).map((v) => v.value)
          : data.firearmLicenseCategory,
      },
    });

    const errors = ["dateLargerThanNow", "nameAlreadyTaken", "invalidImageType"];
    if (errors.includes(error as string)) {
      helpers.setCurrentStep(0);
    }

    if (formData) {
      await execute<PostCitizenImageByIdData>({
        path: `/citizen/${props.citizen.id}`,
        method: "POST",
        data: formData,
        helpers,
      });
    }

    if (json.id) {
      router.push("/admin/manage/citizens");
    }
  }

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem href="/admin/manage/citizens">
          {t("Management.MANAGE_CITIZENS")}
        </BreadcrumbItem>
        <BreadcrumbItem>{t("Citizen.editCitizen")}</BreadcrumbItem>
        <BreadcrumbItem>
          {props.citizen.name} {props.citizen.surname}
        </BreadcrumbItem>
      </Breadcrumbs>

      <Title renderLayoutTitle={false}>
        {t("Common.manage")} {props.citizen.name} {props.citizen.surname}
      </Title>

      <div className="mt-5">
        <ManageCitizenForm
          formFeatures={{
            "edit-name": true,
            "edit-user": true,
            "license-fields": true,
          }}
          citizen={props.citizen}
          onSubmit={handleSubmit}
          state={state}
          cancelURL="/admin/manage/citizens"
        />
      </div>
    </>
  );
}
