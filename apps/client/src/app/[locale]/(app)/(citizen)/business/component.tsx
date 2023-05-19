"use client";

import * as React from "react";
import { GetBusinessesData } from "@snailycad/types/api";
import { useModal } from "~/state/modalState";
import { useTranslations } from "use-intl";
import { useBusinessState } from "~/state/business-state";
import { Permissions, usePermission } from "~/hooks/usePermission";
import { Title } from "~/components/shared/Title";
import { Button } from "@snailycad/ui";
import { ModalIds } from "~/types/ModalIds";
import { BusinessCard } from "~/components/business/BusinessCard";
import dynamic from "next/dynamic";

interface InnerMyBusinessesPageProps {
  defaultData: GetBusinessesData;
}

const CreateBusinessModal = dynamic(
  async () => (await import("components/business/CreateBusinessModal")).CreateBusinessModal,
  { ssr: false },
);

const JoinBusinessModal = dynamic(
  async () => (await import("components/business/JoinBusinessModal")).JoinBusinessModal,
  { ssr: false },
);

export function InnerMyBusinessesPage(props: InnerMyBusinessesPageProps) {
  const { openModal } = useModal();
  const t = useTranslations("Business");
  const setJoinableBusinesses = useBusinessState((s) => s.setJoinableBusinesses);
  const { hasPermissions } = usePermission();
  const hasCreateBusinessesPerms = hasPermissions([Permissions.CreateBusinesses]);

  React.useEffect(() => {
    setJoinableBusinesses(props.defaultData.joinableBusinesses);
  }, [props.defaultData.joinableBusinesses, setJoinableBusinesses]);

  return (
    <>
      <header className="flex items-center justify-between mb-3">
        <Title className="!mb-0">{t("businesses")}</Title>

        <div>
          <Button onPress={() => openModal(ModalIds.JoinBusiness)}>{t("joinBusiness")}</Button>
          {hasCreateBusinessesPerms ? (
            <Button className="ml-2" onPress={() => openModal(ModalIds.CreateBusiness)}>
              {t("createBusiness")}
            </Button>
          ) : null}
        </div>
      </header>

      <section>
        <h3 className="text-xl font-semibold mb-2">{t("owned")}</h3>
        <ul className="space-y-3">
          {props.defaultData.ownedBusinesses.length <= 0 ? (
            <p className="text-neutral-700 dark:text-gray-400">{t("noOwned")}</p>
          ) : (
            props.defaultData.ownedBusinesses.map((employee) => (
              <BusinessCard key={employee.id} employee={employee} />
            ))
          )}
        </ul>
      </section>

      <section className="mt-3">
        <h3 className="text-xl font-semibold mb-2">{t("joined")}</h3>
        <ul className="space-y-3">
          {props.defaultData.joinedBusinesses.length <= 0 ? (
            <p className="text-neutral-700 dark:text-gray-400">{t("notEmployee")}</p>
          ) : (
            props.defaultData.joinedBusinesses.map((employee) => (
              <BusinessCard key={employee.id} employee={employee} />
            ))
          )}
        </ul>
      </section>

      <JoinBusinessModal />
      {hasCreateBusinessesPerms ? <CreateBusinessModal /> : null}
    </>
  );
}
