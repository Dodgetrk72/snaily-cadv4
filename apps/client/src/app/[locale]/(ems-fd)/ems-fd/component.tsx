"use client";

import * as React from "react";
import { useLoadValuesClientSide } from "~/hooks/useLoadValuesClientSide";
import { getEmsFdDashboardData } from "./page";
import { ActiveToneType, StatusValue, ValueType } from "@snailycad/types";
import { useFeatureEnabled } from "~/hooks/use-feature-enabled";
import { useSignal100 } from "~/hooks/shared/useSignal100";
import { useTones } from "~/hooks/global/use-tones";
import { usePanicButton } from "~/hooks/shared/usePanicButton";
import { useEmsFdState } from "~/state/ems-fd-state";
import { useCall911State } from "~/state/dispatch/call-911-state";
import { useDispatchState } from "~/state/dispatch/dispatch-state";
import { usePermission } from "~/hooks/usePermission";
import { defaultPermissions } from "@snailycad/permissions";
import { useTranslations } from "use-intl";
import { Title } from "~/components/shared/Title";
import { UtilityPanel } from "~/components/shared/UtilityPanel";
import { ModalButtons } from "~/components/ems-fd/ModalButtons";
import { StatusesArea } from "~/components/shared/StatusesArea";
import { ActiveCalls } from "~/components/dispatch/active-calls/active-calls";
import { ActiveOfficers } from "~/components/dispatch/active-officers";
import { ActiveDeputies } from "~/components/dispatch/active-deputies";
import dynamic from "next/dynamic";

interface InnerEmsFdDashboardProps {
  data: Awaited<ReturnType<typeof getEmsFdDashboardData>>;
}

const NotepadModal = dynamic(
  async () => (await import("~/components/shared/NotepadModal")).NotepadModal,
  { ssr: false },
);

const SelectDeputyModal = dynamic(
  async () => (await import("~/components/ems-fd/modals/select-deputy-modal")).SelectDeputyModal,
  { ssr: false },
);

const CreateMedicalRecordModal = dynamic(
  async () =>
    (await import("~/components/ems-fd/modals/CreateMedicalRecord")).CreateMedicalRecordModal,
  { ssr: false },
);

const CreateDoctorVisitModal = dynamic(
  async () =>
    (await import("~/components/ems-fd/modals/doctor-visits/create-doctor-visit-modal"))
      .CreateDoctorVisitModal,
  { ssr: false },
);

const SearchMedicalRecordModal = dynamic(
  async () =>
    (await import("~/components/ems-fd/modals/search-medical-records/search-medical-records-modal"))
      .SearchMedicalRecordModal,
  { ssr: false },
);

export function InnerEmsFdDashboard(props: InnerEmsFdDashboardProps) {
  useLoadValuesClientSide({
    valueTypes: [
      ValueType.BLOOD_GROUP,
      ValueType.PENAL_CODE,
      ValueType.IMPOUND_LOT,
      ValueType.DEPARTMENT,
      ValueType.DIVISION,
      ValueType.CODES_10,
    ],
  });

  const { CALLS_911 } = useFeatureEnabled();
  const signal100 = useSignal100();
  const tones = useTones(ActiveToneType.EMS_FD);
  const panic = usePanicButton();
  const state = useEmsFdState();
  const dispatchState = useDispatchState();
  const set911Calls = useCall911State((state) => state.setCalls);
  const { hasPermissions } = usePermission();
  const isAdmin = hasPermissions(defaultPermissions.allDefaultAdminPermissions);

  React.useEffect(() => {
    state.setActiveDeputy(props.data.activeDeputy);
    set911Calls(props.data.active911Calls.calls);
    dispatchState.setActiveDeputies(props.data.activeDeputies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  const t = useTranslations();

  console.log(props.data.values);

  const initialCodes10 =
    (props.data.values.find((v) => v.type === ValueType.CODES_10)?.values as
      | StatusValue[]
      | undefined) ?? ([] as StatusValue[]);

  return (
    <>
      <Title renderLayoutTitle={false}>{t("Ems.emsFd")}</Title>

      <signal100.Component enabled={signal100.enabled} audio={signal100.audio} />
      <panic.Component audio={panic.audio} unit={panic.unit} />
      <tones.Component audio={tones.audio} description={tones.description} user={tones.user} />

      <UtilityPanel>
        <div className="px-4">
          <ModalButtons
            initialCodes10={initialCodes10}
            initialActiveDeputy={props.data.activeDeputy}
          />
        </div>

        <StatusesArea
          setUnits={dispatchState.setActiveDeputies}
          units={dispatchState.activeDeputies}
          setActiveUnit={state.setActiveDeputy}
          activeUnit={state.activeDeputy}
          initialData={props.data.activeDeputy}
        />
      </UtilityPanel>

      <div className="flex flex-col mt-3 md:flex-row md:space-x-3">
        <div className="w-full">
          {CALLS_911 ? <ActiveCalls initialData={props.data.active911Calls} /> : null}
        </div>
      </div>
      <div className="mt-3">
        <ActiveOfficers initialOfficers={[]} />
        <ActiveDeputies initialDeputies={props.data.activeDeputies} />
      </div>

      <SelectDeputyModal />
      {isAdmin || state.activeDeputy ? (
        <>
          <NotepadModal />
          <CreateMedicalRecordModal />
          <SearchMedicalRecordModal />
          <CreateDoctorVisitModal />
        </>
      ) : null}
    </>
  );
}
