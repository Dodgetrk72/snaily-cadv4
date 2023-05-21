"use client";

import { TabList } from "@snailycad/ui";
import { useQuery } from "@tanstack/react-query";
import { Permissions, usePermission } from "hooks/usePermission";
import { usePathname } from "next/navigation";
import { useTranslations } from "use-intl";
import { AdminNotificationKeys } from "~/components/admin/sidebar/sidebar";
import { Title } from "~/components/shared/Title";
import { useAuth } from "~/context/auth-context";

interface ManageBusinessesTabListProps {
  children: React.ReactNode;
  notifications?: Record<AdminNotificationKeys, number>;
}

export function ManageBusinessesTabList(props: ManageBusinessesTabListProps) {
  const pathname = usePathname();
  const t = useTranslations("Management");
  const { cad } = useAuth();

  const { hasPermissions } = usePermission();
  const hasManagePermissions = hasPermissions([Permissions.ManageBusinesses]);
  const isWhitelistedEnabled = (cad?.businessWhitelisted ?? false) && hasManagePermissions;

  const { data } = useQuery({
    initialData: props.notifications,
    queryKey: ["admin", "notifications"],
  });

  const pendingBusinessesCount = data?.pendingBusinesses ?? 0;
  const TABS_TITLES = [
    { name: t("allBusinesses"), value: "allBusinesses", href: "/admin/manage/businesses" },
    {
      isHidden: !isWhitelistedEnabled,
      name: `${t("pendingBusinesses")} (${pendingBusinessesCount})`,
      value: "pendingBusinesses",
      href: "/admin/manage/businesses/pending",
    },
  ];

  const activeTab = TABS_TITLES.findLast((v) => pathname.endsWith(v.href));

  return (
    <>
      <Title>{t("MANAGE_BUSINESSES")}</Title>

      <TabList activeTab={activeTab?.value} tabs={TABS_TITLES}>
        {props.children}
      </TabList>
    </>
  );
}
