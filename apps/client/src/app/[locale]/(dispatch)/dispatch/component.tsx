"use client";

import * as React from "react";
import { ValueType } from "@snailycad/types";
import dynamic from "next/dynamic";
import { useTranslations } from "use-intl";
import { shallow } from "zustand/shallow";
import { DispatchModalButtons } from "~/components/dispatch/ModalButtons";
import { ActiveDeputies } from "~/components/dispatch/active-deputies";
import { ActiveOfficers } from "~/components/dispatch/active-officers";
import { Infofield } from "~/components/shared/Infofield";
import { UtilityPanel } from "~/components/shared/UtilityPanel";
import { usePanicButton } from "~/hooks/shared/usePanicButton";
import { useSignal100 } from "~/hooks/shared/useSignal100";
import { useLoadValuesClientSide } from "~/hooks/useLoadValuesClientSide";
import { useActiveDispatcherState } from "~/state/dispatch/active-dispatcher-state";
import { useDispatchState } from "~/state/dispatch/dispatch-state";
import { useModal } from "~/state/modalState";
import { ModalIds } from "~/types/ModalIds";
import {
  GetActiveOfficersData,
  GetDispatchData,
  GetEmsFdActiveDeputies,
} from "@snailycad/types/api";

const Modals = {
  CustomFieldSearch: dynamic(async () => {
    return (await import("components/leo/modals/CustomFieldSearch/CustomFieldSearch"))
      .CustomFieldSearch;
  }),
  NameSearchModal: dynamic(async () => {
    return (await import("components/leo/modals/NameSearchModal/NameSearchModal")).NameSearchModal;
  }),
  VehicleSearchModal: dynamic(async () => {
    return (await import("components/leo/modals/VehicleSearchModal")).VehicleSearchModal;
  }),
  WeaponSearchModal: dynamic(async () => {
    return (await import("components/leo/modals/weapon-search-modal")).WeaponSearchModal;
  }),
  NotepadModal: dynamic(async () => {
    return (await import("components/shared/NotepadModal")).NotepadModal;
  }),
  AddressSearchModal: dynamic(async () => {
    return (await import("components/dispatch/modals/AddressSearchModal")).AddressSearchModal;
  }),
};

interface InnerDispatchPageProps extends GetDispatchData {
  activeDeputies: GetEmsFdActiveDeputies;
  activeOfficers: GetActiveOfficersData;
}

export function InnerDispatchPage(props: InnerDispatchPageProps) {
  useLoadValuesClientSide({
    valueTypes: [
      ValueType.CALL_TYPE,
      ValueType.CITIZEN_FLAG,
      ValueType.DRIVERSLICENSE_CATEGORY,
      ValueType.IMPOUND_LOT,
      ValueType.LICENSE,
      ValueType.PENAL_CODE,
      ValueType.VEHICLE_FLAG,
      ValueType.DEPARTMENT,
      ValueType.DIVISION,
      ValueType.ADDRESS_FLAG,
    ],
  });

  const t = useTranslations("Leo");
  const { isOpen } = useModal();
  const state = useDispatchState();
  const signal100 = useSignal100();
  const panic = usePanicButton();

  const { userActiveDispatcher, setUserActiveDispatcher } = useActiveDispatcherState(
    (state) => ({
      setUserActiveDispatcher: state.setUserActiveDispatcher,
      userActiveDispatcher: state.userActiveDispatcher,
    }),
    shallow,
  );

  const activeDepartment =
    userActiveDispatcher?.department ?? props.userActiveDispatcher?.department;

  React.useEffect(() => {
    setUserActiveDispatcher(props.userActiveDispatcher, props.activeDispatchersCount);

    state.setActiveDeputies(props.activeDeputies);
    state.setActiveOfficers(props.activeOfficers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <>
      <signal100.Component enabled={signal100.enabled} audio={signal100.audio} />
      <panic.Component audio={panic.audio} unit={panic.unit} />

      <UtilityPanel isDispatch>
        {activeDepartment ? (
          <Infofield className="px-4 py-2" label={t("activeDepartment")}>
            {activeDepartment.value.value}
          </Infofield>
        ) : null}

        <DispatchModalButtons />
      </UtilityPanel>

      <div className="flex flex-col mt-3 md:flex-row md:space-x-3">
        <div className="w-full">
          <ActiveOfficers initialOfficers={props.activeOfficers} />
          <ActiveDeputies initialDeputies={props.activeDeputies} />
        </div>
      </div>

      <Modals.NotepadModal />
      {/* name search have their own vehicle/weapon search modal */}
      {isOpen(ModalIds.NameSearch) ? null : (
        <>
          <Modals.WeaponSearchModal id={ModalIds.WeaponSearch} />
          <Modals.VehicleSearchModal id={ModalIds.VehicleSearch} />
        </>
      )}
      <Modals.AddressSearchModal />
      <Modals.NameSearchModal />
      <Modals.CustomFieldSearch />
    </>
  );
}
