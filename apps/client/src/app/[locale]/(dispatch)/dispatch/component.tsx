"use client";

import * as React from "react";
import { ValueType } from "@snailycad/types";
import dynamic from "next/dynamic";
import { useTranslations } from "use-intl";
import { shallow } from "zustand/shallow";
import { DispatchModalButtons } from "~/components/dispatch/ModalButtons";
import { ActiveCalls } from "~/components/dispatch/active-calls/active-calls";
import { ActiveDeputies } from "~/components/dispatch/active-deputies";
import { ActiveOfficers } from "~/components/dispatch/active-officers";
import { Infofield } from "~/components/shared/Infofield";
import { Title } from "~/components/shared/Title";
import { UtilityPanel } from "~/components/shared/UtilityPanel";
import { usePanicButton } from "~/hooks/shared/usePanicButton";
import { useSignal100 } from "~/hooks/shared/useSignal100";
import { useFeatureEnabled } from "~/hooks/use-feature-enabled";
import { useLoadValuesClientSide } from "~/hooks/useLoadValuesClientSide";
import { useActiveDispatcherState } from "~/state/dispatch/active-dispatcher-state";
import { useCall911State } from "~/state/dispatch/call-911-state";
import { useDispatchState } from "~/state/dispatch/dispatch-state";
import { useModal } from "~/state/modalState";
import { ModalIds } from "~/types/ModalIds";
import {
  Get911CallsData,
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
  calls: Get911CallsData;
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
  const { CALLS_911 } = useFeatureEnabled();
  const state = useDispatchState();
  const set911Calls = useCall911State((state) => state.setCalls);
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
    set911Calls(props.calls.calls);
    // state.setBolos(props.bolos.bolos);

    setUserActiveDispatcher(props.userActiveDispatcher, props.activeDispatchersCount);

    state.setActiveDeputies(props.activeDeputies);
    state.setActiveOfficers(props.activeOfficers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <>
      <Title renderLayoutTitle={false}>{t("dispatch")}</Title>

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
      <div className="mt-3">{CALLS_911 ? <ActiveCalls initialData={props.calls} /> : null}</div>

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
