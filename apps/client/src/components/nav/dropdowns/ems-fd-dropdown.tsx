"use client";

import { usePathname } from "next/navigation";
import { ChevronDown } from "react-bootstrap-icons";
import { useTranslations } from "next-intl";
import { Dropdown } from "components/Dropdown";
import { Button } from "@snailycad/ui";
import { classNames } from "lib/classNames";
import { Permissions, usePermission } from "hooks/usePermission";

export function EmsFdDropdown() {
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const isActive = (route: string) => pathname.startsWith(route);

  const { hasPermissions } = usePermission();
  const hasIncidentPermissions = hasPermissions([
    Permissions.ManageEmsFdIncidents,
    Permissions.ViewEmsFdIncidents,
  ]);
  const hasHospitalServicePermissions = hasPermissions([
    Permissions.ViewDeadCitizens,
    Permissions.ManageDeadCitizens,
  ]);

  return (
    <Dropdown
      trigger={
        <Button
          role="listitem"
          className={classNames(isActive("/ems-fd") && "font-semibold")}
          variant="transparent"
        >
          {t("emsFd")}
          <span className="mt-1 ml-1">
            <ChevronDown width={15} height={15} className="text-gray-700 dark:text-gray-300" />
          </span>
        </Button>
      }
    >
      <Dropdown.LinkItem href="/ems-fd">{t("dashboard")}</Dropdown.LinkItem>
      <Dropdown.LinkItem href="/ems-fd/my-deputies">{t("myDeputies")}</Dropdown.LinkItem>
      <Dropdown.LinkItem href="/ems-fd/my-deputy-logs">{t("myDeputyLogs")}</Dropdown.LinkItem>
      {hasIncidentPermissions ? (
        <Dropdown.LinkItem href="/ems-fd/incidents">{t("emsFdIncidents")}</Dropdown.LinkItem>
      ) : null}
      {hasHospitalServicePermissions ? (
        <Dropdown.LinkItem href="/ems-fd/hospital-services">
          {t("hospitalServices")}
        </Dropdown.LinkItem>
      ) : null}
    </Dropdown>
  );
}
