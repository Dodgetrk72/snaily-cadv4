import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { ManageCourthouseTabList } from "./tab-list";
import { AdminNotificationKeys } from "~/components/admin/sidebar/sidebar";

interface ManageCourthouseLayoutProps {
  children: React.ReactNode;
}

export default async function ManageCourthouseLayout(props: ManageCourthouseLayoutProps) {
  const { data } = await handleServerRequest<Record<AdminNotificationKeys, number>>({
    path: "/notifications/admin",
  });

  return <ManageCourthouseTabList notifications={data}>{props.children}</ManageCourthouseTabList>;
}
