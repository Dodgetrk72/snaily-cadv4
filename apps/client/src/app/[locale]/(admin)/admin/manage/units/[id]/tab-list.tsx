"use client";

import { TabList } from "@snailycad/ui";
import { usePathname } from "next/navigation";
import { useTranslations } from "use-intl";
import { Title } from "~/components/shared/Title";
import { Permissions, usePermission } from "~/hooks/usePermission";

interface ManageUnitByIdTabListProps {
  children: React.ReactNode;
  params: { id: string };
}

export function ManageUnitByIdTabList(props: ManageUnitByIdTabListProps) {
  const pathname = usePathname();
  const t = useTranslations("Management");

  const { hasPermissions } = usePermission();
  const hasManagePermissions = hasPermissions([Permissions.ManageUnits]);
  const hasManageAwardsPermissions = hasPermissions([Permissions.ManageAwardsAndQualifications]);

  const TABS = [
    {
      isHidden: !hasManagePermissions || !hasManageAwardsPermissions,
      href: `/admin/manage/units/${props.params.id}`,
      name: "Manage Unit",
      value: "manage-unit",
    },
    {
      isHidden: !hasManagePermissions,
      href: `/admin/manage/units/${props.params.id}/logs`,
      name: t("callsignManagement"),
      value: "callsignManagement",
    },
  ];

  const activeTab = TABS.findLast((v) => pathname.endsWith(v.href));

  return (
    <>
      <Title>{t("MANAGE_UNITS")}</Title>

      <TabList activeTab={activeTab?.value} tabs={TABS}>
        {props.children}
      </TabList>
    </>
  );
}
