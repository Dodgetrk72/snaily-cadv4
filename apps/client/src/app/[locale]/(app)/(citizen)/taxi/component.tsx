"use client";

import * as React from "react";
import { Button } from "@snailycad/ui";
import { TowTaxiCallsTable } from "~/components/calls/TowTaxiCallsTable";
import { Title } from "~/components/shared/Title";
import { useModal } from "~/state/modalState";
import { TaxiCall } from "@snailycad/types";
import { GetTaxiCallsData } from "@snailycad/types/api";
import { useTranslations } from "use-intl";
import { SocketEvents } from "@snailycad/config";
import { useListener } from "@casper124578/use-socket.io";
import { ModalIds } from "~/types/ModalIds";

interface InnerTaxiPageProps {
  calls: GetTaxiCallsData;
}

export function InnerTaxiPage(props: InnerTaxiPageProps) {
  const { openModal } = useModal();
  const [calls, setCalls] = React.useState<TaxiCall[]>(props.calls);
  const t = useTranslations("Calls");

  useListener(SocketEvents.CreateTaxiCall, (data: TaxiCall) => {
    const isAlreadyInCalls = calls.some((v) => v.id === data.id);

    if (!isAlreadyInCalls) {
      setCalls((p) => [data, ...p]);
    }
  });

  useListener(SocketEvents.EndTaxiCall, handleCallEnd);

  useListener(SocketEvents.UpdateTaxiCall, (data: TaxiCall) => {
    const old = calls.find((v) => v.id === data.id);

    if (old) {
      setCalls((p) => {
        const removed = p.filter((v) => v.id !== data.id);

        return [data, ...removed];
      });
    }
  });

  function onCreateClick() {
    openModal(ModalIds.ManageTowCall);
  }

  function handleCallEnd(call: TaxiCall) {
    setCalls((p) => p.filter((v) => v.id !== call.id));
  }

  React.useEffect(() => {
    setCalls(props.calls);
  }, [props.calls]);

  return (
    <>
      <header className="flex items-center justify-between mb-5">
        <Title>{t("taxi")}</Title>

        <Button onPress={onCreateClick}>{t("createTaxiCall")}</Button>
      </header>

      <TowTaxiCallsTable
        type="taxi"
        noCallsText={t("noTaxiCalls")}
        setCalls={setCalls}
        calls={calls}
      />
    </>
  );
}
