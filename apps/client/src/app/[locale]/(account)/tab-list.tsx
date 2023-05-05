"use client";

import { TabList } from "@snailycad/ui";
import { useFeatureEnabled } from "hooks/useFeatureEnabled";
import { Permissions, usePermission } from "hooks/usePermission";
import { canUseThirdPartyConnections } from "lib/utils";
import { usePathname } from "next/navigation";
import { useTranslations } from "use-intl";

interface AccountTabListProps {
  children: React.ReactNode;
}

export function AccountTabList(props: AccountTabListProps) {
  const pathname = usePathname();
  const { DISCORD_AUTH, STEAM_OAUTH, USER_API_TOKENS } = useFeatureEnabled();
  const t = useTranslations("Account");

  const showConnectionsTab = (DISCORD_AUTH || STEAM_OAUTH) && canUseThirdPartyConnections();
  const { hasPermissions } = usePermission();
  const hasApiTokenPermissions = hasPermissions([Permissions.UsePersonalApiToken]);

  const TABS_TITLES = [
    { name: t("accountInfo"), value: "accountInfo", href: "/account" },
    { name: t("accountSettings"), value: "accountSettings", href: "/account/settings" },
    { name: t("appearanceSettings"), value: "appearanceSettings", href: "/account/appearance" },
  ];

  if (showConnectionsTab) {
    TABS_TITLES[3] = { name: t("connections"), value: "connections", href: "/account/connections" };
  }

  if (USER_API_TOKENS && hasApiTokenPermissions) {
    const idx = showConnectionsTab ? 4 : 3;
    TABS_TITLES[idx] = {
      href: "/account/api-token",
      name: t("userApiToken"),
      value: "userApiToken",
    };
  }

  const activeTab = TABS_TITLES.findLast((v) => pathname?.endsWith(v.href));

  return (
    <TabList activeTab={activeTab?.value} tabs={TABS_TITLES}>
      {props.children}
    </TabList>
  );
}
