"use client";

import * as React from "react";
import { GetCitizensData } from "@snailycad/types/api";
import { Button, buttonVariants } from "@snailycad/ui";
import { CitizenList } from "components/citizen/citizen-list/citizen-list";
import { Title } from "components/shared/Title";
import { useAreaOfPlay } from "hooks/global/useAreaOfPlay";
import { useSignal100 } from "hooks/shared/useSignal100";
import { useFeatureEnabled } from "hooks/useFeatureEnabled";
import { useModal } from "state/modalState";
import { ModalIds } from "types/ModalIds";
import { useTranslations } from "use-intl";
import dynamic from "next/dynamic";
import { Link } from "~/components/shared/link";

interface UserCitizensPageProps {
  data: GetCitizensData;
}

const modals = {
  RegisterVehicleModal: dynamic(
    async () =>
      (await import("components/citizen/vehicles/modals/register-vehicle-modal"))
        .RegisterVehicleModal,
    { ssr: false },
  ),
  RegisterWeaponModal: dynamic(
    async () =>
      (await import("components/citizen/weapons/register-weapon-modal")).RegisterWeaponModal,
    { ssr: false },
  ),
  ManageCallModal: dynamic(
    async () => (await import("components/citizen/tow/manage-tow-call")).ManageCallModal,
    { ssr: false },
  ),
  Manage911CallModal: dynamic(
    async () => (await import("components/dispatch/modals/Manage911CallModal")).Manage911CallModal,
    { ssr: false },
  ),
};

export function UserCitizensPageInner(props: UserCitizensPageProps) {
  const t = useTranslations("Citizen");

  const [modal, setModal] = React.useState<string | null>(null);
  const { openModal, closeModal } = useModal();
  const signal100 = useSignal100();
  const areaOfPlay = useAreaOfPlay();
  const { SIGNAL_100_CITIZEN, TOW, TAXI, WEAPON_REGISTRATION, CALLS_911 } = useFeatureEnabled();

  return (
    <>
      {SIGNAL_100_CITIZEN ? (
        <signal100.Component enabled={signal100.enabled} audio={signal100.audio} />
      ) : null}
      <header className="my-3">
        <Title className="mb-2">{t("citizens")}</Title>
        {areaOfPlay.showAop ? (
          <h2 className="font-semibold text-xl">AOP: {areaOfPlay.areaOfPlay}</h2>
        ) : null}
      </header>
      <ul className="grid grid-cols-1 gap-2 mb-3 sm:grid-cols-2 md:grid-cols-3">
        <li>
          <Link
            href="/citizen/create"
            className={`rounded-md transition-all p-1 px-4 ${buttonVariants.default} block w-full`}
          >
            {t("createCitizen")}
          </Link>
        </li>
        <li>
          <Button onPress={() => openModal(ModalIds.RegisterVehicle)} className="text-left w-full">
            {t("registerVehicle")}
          </Button>
        </li>
        {WEAPON_REGISTRATION ? (
          <li>
            <Button onPress={() => openModal(ModalIds.RegisterWeapon)} className="text-left w-full">
              {t("registerWeapon")}
            </Button>
          </li>
        ) : null}

        {TOW ? (
          <li>
            <Button
              onPress={() => {
                setModal("tow");
                openModal(ModalIds.ManageTowCall);
              }}
              className="text-left w-full"
            >
              {t("createTowCall")}
            </Button>
          </li>
        ) : null}
        {TAXI ? (
          <li>
            <Button
              onPress={() => {
                setModal("taxi");
                openModal(ModalIds.ManageTowCall);
              }}
              className="text-left w-full"
            >
              {t("createTaxiCall")}
            </Button>
          </li>
        ) : null}
        {CALLS_911 ? (
          <li>
            <Button onPress={() => openModal(ModalIds.Manage911Call)} className="text-left w-full">
              {t("create911Call")}
            </Button>
          </li>
        ) : null}
      </ul>
      <CitizenList citizens={props.data} />
      <modals.RegisterVehicleModal
        onCreate={() => closeModal(ModalIds.RegisterVehicle)}
        vehicle={null}
      />
      {WEAPON_REGISTRATION ? (
        <modals.RegisterWeaponModal
          onCreate={() => closeModal(ModalIds.RegisterWeapon)}
          weapon={null}
        />
      ) : null}
      {CALLS_911 ? <modals.Manage911CallModal call={null} /> : null}
      {TOW || TAXI ? <modals.ManageCallModal isTow={modal === "tow"} call={null} /> : null}{" "}
    </>
  );
}
