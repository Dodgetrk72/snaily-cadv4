"use client";

import * as React from "react";
import { Title } from "~/components/shared/Title";
import { TowCall } from "@snailycad/types";
import { GetTowCallsData } from "@snailycad/types/api";
import { useTranslations } from "use-intl";
import { SocketEvents } from "@snailycad/config";
import { useListener } from "@casper124578/use-socket.io";
import { Table, useTableState } from "~/components/shared/Table";
import { CallDescription } from "~/components/dispatch/active-calls/CallDescription";
import { FullDate } from "~/components/shared/FullDate";

interface InnerTowLogsPageProps {
  calls: GetTowCallsData;
}

export function InnerTowLogsPage(props: InnerTowLogsPageProps) {
  const [calls, setCalls] = React.useState<TowCall[]>(props.calls);
  const common = useTranslations("Common");
  const t = useTranslations("Calls");
  const tableState = useTableState();

  useListener(SocketEvents.EndTowCall, handleCallEnd);

  function handleCallEnd(call: TowCall) {
    setCalls((p) => [call, ...p]);
  }

  function assignedUnit(call: TowCall) {
    return call.assignedUnit ? (
      <span>
        {call.assignedUnit.name} {call.assignedUnit.surname}
      </span>
    ) : (
      <span>{common("none")}</span>
    );
  }

  React.useEffect(() => {
    setCalls(props.calls);
  }, [props.calls]);

  return (
    <>
      <header>
        <Title>{t("towLogs")}</Title>
        <p className="max-w-2xl mt-2 text-neutral-700 dark:text-gray-400">
          {t("towLogsDescription")}
        </p>
      </header>

      {calls.length <= 0 ? (
        <p className="text-neutral-700 dark:text-gray-400 mt-10">{t("noTowCalls")}</p>
      ) : (
        <Table
          tableState={tableState}
          data={calls.map((call) => ({
            id: call.id,
            location: call.location,
            postal: call.postal || common("none"),
            description: <CallDescription nonCard data={call} />,
            caller: call.creator ? `${call.creator.name} ${call.creator.surname}` : "Dispatch",
            assignedUnit: assignedUnit(call),
            createdAt: <FullDate>{call.createdAt}</FullDate>,
          }))}
          columns={[
            { header: t("location"), accessorKey: "location" },
            { header: t("postal"), accessorKey: "postal" },
            { header: common("description"), accessorKey: "description" },
            { header: t("caller"), accessorKey: "caller" },
            { header: t("assignedUnit"), accessorKey: "assignedUnit" },
            { header: common("createdAt"), accessorKey: "createdAt" },
          ]}
        />
      )}
    </>
  );
}
