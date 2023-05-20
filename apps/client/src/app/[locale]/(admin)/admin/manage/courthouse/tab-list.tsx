"use client";

import { TabList } from "@snailycad/ui";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useTranslations } from "use-intl";
import { AdminNotificationKeys } from "~/components/admin/sidebar/sidebar";
import { Title } from "~/components/shared/Title";
import { Permissions, usePermission } from "~/hooks/usePermission";

interface ManageCourthouseTabListProps {
  children: React.ReactNode;
  notifications?: Record<AdminNotificationKeys, number>;
}

export function ManageCourthouseTabList(props: ManageCourthouseTabListProps) {
  const pathname = usePathname();
  const t = useTranslations("Management");

  const { data } = useQuery({
    initialData: props.notifications,
    queryKey: ["admin", "notifications"],
  });

  const { hasPermissions } = usePermission();

  const hasNameChangePerms = hasPermissions([
    Permissions.ViewNameChangeRequests,
    Permissions.ManageNameChangeRequests,
  ]);

  const hasExpungementPerms = hasPermissions([
    Permissions.ViewExpungementRequests,
    Permissions.ManageExpungementRequests,
  ]);

  const hasManageWarrantPerms = hasPermissions([Permissions.ManagePendingWarrants]);

  const pendingExpungementRequestsCount = data?.pendingExpungementRequests ?? 0;
  const pendingNameChangeRequestsCount = data?.pendingNameChangeRequests ?? 0;
  const pendingWarrantsCount = data?.pendingWarrants ?? 0;

  const TABS = [
    {
      isHidden: !hasExpungementPerms,
      href: "/admin/manage/courthouse/expungement-requests",
      name: `${t("MANAGE_EXPUNGEMENT_REQUESTS")} (${pendingExpungementRequestsCount})`,
      value: "expungement-requests",
    },
    {
      isHidden: !hasNameChangePerms,
      href: "/admin/manage/courthouse/name-change-requests",
      name: `${t("MANAGE_NAME_CHANGE_REQUESTS")} (${pendingNameChangeRequestsCount})`,
      value: "name-change-requests",
    },
    {
      isHidden: !hasManageWarrantPerms,
      href: "/admin/manage/courthouse/pending-warrants",
      name: `${t("MANAGE_PENDING_WARRANTS")} (${pendingWarrantsCount})`,
      value: "pending-warrants",
    },
  ];

  const activeTab = TABS.findLast((v) => pathname.endsWith(v.href));
  const defaultTab = TABS.find((v) => !v.isHidden);

  return (
    <>
      <header className="mb-5">
        <Title>{t("MANAGE_COURTHOUSE")}</Title>
        <p className="text-neutral-700 dark:text-gray-400 my-2">
          {t("manageCourthouseDescription")}
        </p>
      </header>

      <TabList defaultValue={defaultTab?.value} activeTab={activeTab?.value} tabs={TABS}>
        {props.children}
      </TabList>
    </>
  );
}
