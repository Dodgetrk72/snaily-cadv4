import { Button, TabsContent } from "@snailycad/ui";
import { FormField } from "components/form/FormField";
import { Select } from "components/form/Select";
import { useFormikContext } from "formik";
import { useActiveIncidents } from "hooks/realtime/useActiveIncidents";
import { useCall911State } from "state/dispatch/call-911-state";
import { useModal } from "state/modalState";
import { ModalIds } from "types/modal-ids";
import { useTranslations } from "use-intl";

import dynamic from "next/dynamic";
import type { Record } from "@snailycad/types";

const ManageIncidentModal = dynamic(
  async () => (await import("components/leo/incidents/manage-incident-modal")).ManageIncidentModal,
);

const Manage911CallModal = dynamic(
  async () =>
    (await import("components/dispatch/modals/manage-911-call/manage-911-call-modal"))
      .Manage911CallModal,
);

interface _FormikContext {
  call911Id: string | null;
  incidentId: string | null;
}

export function ConnectionsTab({
  isReadOnly,
  record,
}: {
  record?: Record | null;
  isReadOnly?: boolean;
}) {
  const t = useTranslations("Leo");
  const { handleChange, errors, values } = useFormikContext<_FormikContext>();

  const { calls, setCurrentlySelectedCall } = useCall911State((state) => ({
    calls: state.calls,
    setCurrentlySelectedCall: state.setCurrentlySelectedCall,
  }));
  const { activeIncidents } = useActiveIncidents();
  const modalState = useModal();

  const incident =
    (values.incidentId && (record as any)?.incident) ??
    activeIncidents.find((incident) => incident.id === values.incidentId) ??
    null;

  const _incidents = incident
    ? [incident, ...activeIncidents.filter((v) => v.id !== incident.id)]
    : activeIncidents;

  const call =
    (values.call911Id && (record as any)?.call911) ??
    calls.find((call) => call.id === values.call911Id) ??
    null;

  const _calls = call ? [call, ...calls.filter((v) => v.id !== call.id)] : calls;

  return (
    <TabsContent value="connections-tab">
      <header className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold">{t("connections")}</h3>
      </header>

      <FormField optional errorMessage={errors.incidentId as string} label={t("incident")}>
        <div className="flex gap-2">
          <Select
            className="w-full"
            disabled={isReadOnly}
            values={_incidents.map((incident) => ({
              value: incident.id,
              label: `#${incident.caseNumber}`,
            }))}
            value={incident?.id || values.incidentId}
            onChange={handleChange}
            name="incidentId"
            isClearable
          />
          {values.incidentId ? (
            <>
              <Button
                onClick={() => {
                  modalState.openModal(ModalIds.ManageIncident);
                }}
                className="min-w-fit"
              >
                {t("viewIncident")}
              </Button>

              {incident ? <ManageIncidentModal type="leo" incident={incident} /> : null}
            </>
          ) : null}
        </div>
      </FormField>

      <FormField optional errorMessage={errors.call911Id as string} label={t("call")}>
        <div className="flex gap-2">
          <Select
            className="w-full"
            disabled={isReadOnly}
            values={_calls.map((call) => ({
              value: call.id,
              label: `#${call.caseNumber}`,
            }))}
            value={call?.id || values.call911Id}
            onChange={handleChange}
            name="call911Id"
            isClearable
          />
          {values.call911Id ? (
            <>
              <Button
                onClick={() => {
                  setCurrentlySelectedCall(call);
                  modalState.openModal(ModalIds.Manage911Call);
                }}
                className="min-w-fit"
              >
                {t("viewCall")}
              </Button>

              {call ? <Manage911CallModal call={call} forceDisabled /> : null}
            </>
          ) : null}
        </div>
      </FormField>
    </TabsContent>
  );
}
