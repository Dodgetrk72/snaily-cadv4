"use client";

import * as React from "react";
import { useTranslations } from "use-intl";
import { useModal } from "~/state/modalState";
import { ModalIds } from "~/types/ModalIds";
import { Title } from "~/components/shared/Title";
import { Button } from "@snailycad/ui";
import { AdvancedCitizensTab } from "~/components/admin/manage/citizens/AdvancedCitizensTab";
import { useLoadValuesClientSide } from "~/hooks/useLoadValuesClientSide";
import { ValueType } from "@snailycad/types";

export function InnerImportCitizensPage() {
  const t = useTranslations("Management");
  const { openModal } = useModal();

  useLoadValuesClientSide({
    valueTypes: [ValueType.GENDER, ValueType.ETHNICITY],
  });

  return (
    <>
      <header>
        <div className="flex items-center justify-between">
          <Title className="!mb-0">{t("IMPORT_CITIZENS")}</Title>

          <div className="min-w-fit w-fit">
            <Button onPress={() => openModal(ModalIds.ImportCitizens)}>Import via file</Button>
          </div>
        </div>

        <p className="my-2 text-neutral-700 dark:text-gray-400 max-w-2xl">
          {t("importCitizensDescription")}
        </p>
      </header>

      <AdvancedCitizensTab />
    </>
  );
}
