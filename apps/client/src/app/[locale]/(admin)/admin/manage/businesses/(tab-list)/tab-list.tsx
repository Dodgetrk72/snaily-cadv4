"use client";

import { TabList } from "@snailycad/ui";
import { Permissions, usePermission } from "hooks/usePermission";
import { usePathname } from "next/navigation";
import { useTranslations } from "use-intl";
import { Title } from "~/components/shared/Title";
import { useAuth } from "~/context/auth-context";

interface ManageBusinessesTabListProps {
  children: React.ReactNode;
}

export function ManageBusinessesTabList(props: ManageBusinessesTabListProps) {
  const pathname = usePathname();
  const t = useTranslations("Management");
  const { cad } = useAuth();

  const { hasPermissions } = usePermission();
  const hasManagePermissions = hasPermissions([Permissions.ManageBusinesses]);
  const isWhitelistedEnabled = (cad?.businessWhitelisted ?? false) && hasManagePermissions;

  const TABS_TITLES = [
    { name: t("allBusinesses"), value: "allBusinesses", href: "/admin/manage/businesses" },
    {
      // todo: add count
      isHidden: !isWhitelistedEnabled,
      name: t("pendingBusinesses"),
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
