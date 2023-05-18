"use client";

import { GetManageUsersData } from "@snailycad/types/api";
import { AllUsersTab } from "~/components/admin/manage/users/tabs/all-users-tab";

interface InnerManageUsersPageProps {
  defaultData: GetManageUsersData;
}

export function InnerManageUsersPage(props: InnerManageUsersPageProps) {
  return <AllUsersTab {...props.defaultData} />;
}
