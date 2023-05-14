"use client";

import "leaflet/dist/leaflet.css";

import * as React from "react";
import { ValueType } from "@snailycad/types";
import {
  Get911CallsData,
  GetActiveOfficersData,
  GetBolosData,
  GetEmsFdActiveDeputies,
} from "@snailycad/types/api";
import dynamic from "next/dynamic";
import { Title } from "~/components/shared/Title";
import { useLoadValuesClientSide } from "~/hooks/useLoadValuesClientSide";
import { useCall911State } from "~/state/dispatch/call-911-state";
import { useDispatchState } from "~/state/dispatch/dispatch-state";

const LiveMap = dynamic(async () => (await import("~/components/dispatch/map/Map")).Map, {
  ssr: false,
  loading: () => <p>loading map..</p>,
});

interface InnerDispatchMapPageProps {
  bolos: GetBolosData;
  calls: Get911CallsData;
  activeDeputies: GetEmsFdActiveDeputies;
  activeOfficers: GetActiveOfficersData;
}

export function InnerDispatchMapPage(props: InnerDispatchMapPageProps) {
  useLoadValuesClientSide({
    valueTypes: [
      ValueType.CALL_TYPE,
      ValueType.PENAL_CODE,
      ValueType.DEPARTMENT,
      ValueType.DIVISION,
    ],
  });

  const state = useDispatchState();
  const set911Calls = useCall911State((state) => state.setCalls);

  React.useEffect(() => {
    set911Calls(props.calls.calls);
    state.setBolos(props.bolos.bolos);

    state.setActiveDeputies(props.activeDeputies);
    state.setActiveOfficers(props.activeOfficers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <>
      <Title renderLayoutTitle={false}>Dispatch Live Map</Title>

      <LiveMap />
    </>
  );
}
