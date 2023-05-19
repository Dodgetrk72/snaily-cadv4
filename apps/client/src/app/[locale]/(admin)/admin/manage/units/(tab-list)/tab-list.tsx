"use client";

import { TabList } from "@snailycad/ui";
import { usePathname } from "next/navigation";
import { useTranslations } from "use-intl";
import { Title } from "~/components/shared/Title";
import { Permissions, usePermission } from "~/hooks/usePermission";

interface ManageUnitsTabListProps {
  pendingUnitsCount: number;
  children: React.ReactNode;
}

export function ManageUnitsTabList(props: ManageUnitsTabListProps) {
  const pathname = usePathname();
  const t = useTranslations("Management");

  const { hasPermissions } = usePermission();
  const hasViewPermissions = hasPermissions([
    Permissions.ManageUnits,
    Permissions.ViewUnits,
    Permissions.DeleteUnits,
    Permissions.ManageAwardsAndQualifications,
  ]);
  const hasManagePermissions = hasPermissions([Permissions.ManageUnits]);
  const hasManageCallsignPermissions = hasPermissions([Permissions.ManageUnitCallsigns]);
  const hasManageDepartmentWhitelistingPermissions =
    hasManagePermissions && props.pendingUnitsCount > 0;

  const TABS = [
    {
      isHidden: !hasViewPermissions,
      href: "/admin/manage/units",
      name: t("allUnits"),
      value: "allUnits",
    },
    {
      isHidden: !hasManageCallsignPermissions,
      href: "/admin/manage/units/callsigns",
      name: t("callsignManagement"),
      value: "callsignManagement",
    },
    {
      isHidden: !hasManageDepartmentWhitelistingPermissions,
      href: "/admin/manage/units/department-whitelisting",
      name: t.rich("departmentWhitelisting", { length: props.pendingUnitsCount }).toString(),
      value: "departmentWhitelisting",
    },
    {
      isHidden: false,
      href: "/admin/manage/units/department-time-logs",
      name: t("departmentTimeLogs"),
      value: "departmentTimeLogs",
    },
  ];

  const activeTab = TABS.findLast((v) => pathname.endsWith(v.href));
  const defaultTab = TABS.find((v) => !v.isHidden);

  return (
    <>
      <Title>{t("MANAGE_UNITS")}</Title>

      <TabList defaultValue={defaultTab?.value} activeTab={activeTab?.value} tabs={TABS}>
        {props.children}
      </TabList>
    </>
  );
}
