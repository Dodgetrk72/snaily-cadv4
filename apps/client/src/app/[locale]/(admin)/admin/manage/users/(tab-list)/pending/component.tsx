"use client";

import { GetManageUsersData } from "@snailycad/types/api";
import { PendingUsersTab } from "~/components/admin/manage/users/tabs/pending-users-tab";

interface InnerManagePendingUsersPageProps {
  defaultData: GetManageUsersData;
}

export function InnerManagePendingUsersPage(props: InnerManagePendingUsersPageProps) {
  return <PendingUsersTab {...props.defaultData} />;
}
