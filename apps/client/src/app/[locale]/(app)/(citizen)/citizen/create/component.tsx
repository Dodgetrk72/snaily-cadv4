"use client";

import { PostCitizenImageByIdData, PostCitizensData } from "@snailycad/types/api";
import { BreadcrumbItem, Breadcrumbs } from "@snailycad/ui";
import { useRouter } from "next/navigation";
import { useTranslations } from "use-intl";
import { ManageCitizenForm } from "~/components/citizen/manage-citizen-form";
import { SelectValue } from "~/components/form/Select";
import { Title } from "~/components/shared/Title";
import useFetch from "~/lib/useFetch";

export function InnerCreateCitizenPage() {
  const t = useTranslations("Citizen");
  const { state, execute } = useFetch();
  const router = useRouter();

  async function onSubmit({
    formData,
    data,
    helpers,
  }: {
    formData?: FormData;
    data: any;
    helpers: any;
  }) {
    const { json, error } = await execute<PostCitizensData>({
      path: "/citizen",
      method: "POST",
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

    if (json?.id) {
      if (formData) {
        await execute<PostCitizenImageByIdData>({
          path: `/citizen/${json.id}`,
          method: "POST",
          data: formData,
          helpers,
          headers: {
            "content-type": "multipart/form-data",
          },
        });
      }

      const path = `/citizen/${json.id}`;
      router.push(path);
    }
  }

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem href="/citizen">{t("citizen")}</BreadcrumbItem>
        <BreadcrumbItem>{t("createCitizen")}</BreadcrumbItem>
      </Breadcrumbs>

      <Title>{t("createCitizen")}</Title>

      <ManageCitizenForm
        onSubmit={onSubmit}
        citizen={null}
        state={state}
        formFeatures={{
          "edit-name": true,
          "license-fields": true,
          "officer-creation": true,
          "previous-records": true,
        }}
      />
    </>
  );
}
