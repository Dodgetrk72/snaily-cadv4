"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "use-intl";
import { BreadcrumbItem, Breadcrumbs } from "@snailycad/ui";
import useFetch from "~/lib/useFetch";
import { useCitizen } from "~/context/citizen-context";
import { useLoadValuesClientSide } from "~/hooks/useLoadValuesClientSide";
import { ValueType } from "@snailycad/types";
import { PostCitizenImageByIdData, PutCitizenByIdData } from "@snailycad/types/api";
import {
  ManageCitizenForm,
  ManageCitizenFormSubmitHandlerData,
} from "~/components/citizen/manage-citizen-form";

export function InnerEditUserCitizenPage() {
  useLoadValuesClientSide({
    valueTypes: [ValueType.GENDER, ValueType.ETHNICITY],
  });

  const { state, execute } = useFetch();
  const router = useRouter();
  const t = useTranslations("Citizen");

  const { citizen } = useCitizen();

  if (!citizen) {
    return null;
  }

  async function onSubmit({ formData, data, helpers }: ManageCitizenFormSubmitHandlerData) {
    if (!citizen) return;

    const { json } = await execute<PutCitizenByIdData>({
      path: `/citizen/${citizen.id}`,
      method: "PUT",
      data,
      helpers,
    });

    if (formData) {
      await execute<PostCitizenImageByIdData>({
        path: `/citizen/${citizen.id}`,
        method: "POST",
        data: formData,
        helpers,
        headers: {
          "content-type": "multipart/form-data",
        },
      });
    }

    if (json?.id) {
      router.push(`/citizen/${json.id}`);
    }
  }

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem href="/citizen">{t("citizen")}</BreadcrumbItem>
        <BreadcrumbItem href={`/citizen/${citizen.id}`}>
          {citizen.name} {citizen.surname}
        </BreadcrumbItem>
        <BreadcrumbItem>{t("editCitizen")}</BreadcrumbItem>
      </Breadcrumbs>

      <ManageCitizenForm citizen={citizen} onSubmit={onSubmit} state={state} />
    </>
  );
}
