"use client";

import * as React from "react";
import { Button } from "@snailycad/ui";
import { TowTaxiCallsTable } from "~/components/calls/TowTaxiCallsTable";
import { Title } from "~/components/shared/Title";
import { useModal } from "~/state/modalState";
import { TowCall } from "@snailycad/types";
import { GetTowCallsData } from "@snailycad/types/api";
import { useTranslations } from "use-intl";
import { SocketEvents } from "@snailycad/config";
import { useListener } from "@casper124578/use-socket.io";
import { ModalIds } from "~/types/ModalIds";

interface InnerTowPageProps {
  calls: GetTowCallsData;
}

export function InnerTowPage(props: InnerTowPageProps) {
  const { openModal } = useModal();
  const [calls, setCalls] = React.useState<TowCall[]>(props.calls);
  const t = useTranslations("Calls");

  useListener(SocketEvents.CreateTowCall, (data: TowCall) => {
    const isAlreadyInCalls = calls.some((v) => v.id === data.id);

    if (!isAlreadyInCalls) {
      setCalls((p) => [data, ...p]);
    }
  });

  useListener(SocketEvents.EndTowCall, handleCallEnd);

  useListener(SocketEvents.UpdateTowCall, (data: TowCall) => {
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

  function handleCallEnd(call: TowCall) {
    setCalls((p) => p.filter((v) => v.id !== call.id));
  }

  React.useEffect(() => {
    setCalls(props.calls);
  }, [props.calls]);

  return (
    <>
      <header className="flex items-center justify-between mb-5">
        <Title>{t("tow")}</Title>

        <Button onPress={onCreateClick}>{t("createTowCall")}</Button>
      </header>

      <TowTaxiCallsTable
        type="tow"
        noCallsText={t("noTowCalls")}
        setCalls={setCalls as any}
        calls={calls}
      />
    </>
  );
}
