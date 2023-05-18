"use client";

import { TabList } from "@snailycad/ui";
import { usePathname } from "next/navigation";
import { useTranslations } from "use-intl";
import { useFeatureEnabled } from "~/hooks/use-feature-enabled";
import { Permissions, usePermission } from "~/hooks/usePermission";

interface AccountTabListProps {
  children: React.ReactNode;
}

export function AccountTabList(props: AccountTabListProps) {
  const pathname = usePathname();
  const t = useTranslations("Courthouse");
  const { COURTHOUSE_POSTS } = useFeatureEnabled();

  const { hasPermissions } = usePermission();
  const hasEntriesPerms = hasPermissions([Permissions.Leo]);

  const TABS = [
    {
      href: "/courthouse/expungement-requests",
      enabled: true,
      name: t("expungementRequests"),
      value: "expungementRequestsTab",
    },
    {
      href: "/courthouse/name-change-requests",
      enabled: true,
      name: t("nameChangeRequests"),
      value: "nameChangeRequestsTab",
    },
    {
      href: "/courthouse/entries",
      enabled: hasEntriesPerms,
      name: t("courtEntries"),
      value: "courtEntriesTab",
    },
    {
      href: "/courthouse/posts",
      enabled: COURTHOUSE_POSTS,
      name: t("courthousePosts"),
      value: "courthousePosts",
    },
  ];

  const activeTab = TABS.findLast((v) => pathname.endsWith(v.href));

  return (
    <TabList activeTab={activeTab?.value} tabs={TABS}>
      {props.children}
    </TabList>
  );
}
