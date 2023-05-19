"use client";

import { GetManageBusinessesData } from "@snailycad/types/api";
import { PendingBusinessesTab } from "~/components/admin/manage/business/pending-businesses-tab";

interface InnerManagePendingBusinessesPageProps {
  defaultData: GetManageBusinessesData;
}

export function InnerManagePendingBusinessesPage(props: InnerManagePendingBusinessesPageProps) {
  return <PendingBusinessesTab {...props} />;
}
