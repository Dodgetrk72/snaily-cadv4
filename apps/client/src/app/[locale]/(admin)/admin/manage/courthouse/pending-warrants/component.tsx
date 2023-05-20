"use client";

import { GetManagePendingWarrants } from "@snailycad/types/api";
import { PendingWarrantsTab } from "~/components/admin/manage/courthouse/pending-warrants-tab";

interface InnerManagePendingWarrantsTabPageProps {
  defaultData: GetManagePendingWarrants;
}

export function InnerManagePendingWarrantsTabPage(props: InnerManagePendingWarrantsTabPageProps) {
  return <PendingWarrantsTab defaultData={props.defaultData} />;
}
