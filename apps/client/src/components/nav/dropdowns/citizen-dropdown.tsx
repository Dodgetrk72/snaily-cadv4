import { usePathname } from "next/navigation";
import { ChevronDown } from "react-bootstrap-icons";
import { useFeatureEnabled } from "hooks/use-feature-enabled";
import type { Feature } from "@snailycad/types";
import { useTranslations } from "next-intl";
// import { Dropdown } from "components/Dropdown";
import { Button, Item, DropdownMenuButton } from "@snailycad/ui";
import { classNames } from "lib/classNames";
import { useAuth } from "~/context/auth-context";
import { usePermission, Permissions } from "hooks/usePermission";

export function CitizenDropdown() {
  const enabled = useFeatureEnabled();
  const pathname = usePathname();
  const isActive = (route: string) => pathname.startsWith(route);
  const t = useTranslations("Nav");
  const { user } = useAuth();
  const { hasPermissions } = usePermission();

  const items = [
    { key: "citizens", name: t("citizens"), href: "/citizens" },
    {
      key: "taxi",
      name: t("taxi"),
      href: "/taxi",
      show: hasPermissions([Permissions.ViewTaxiCalls, Permissions.ManageTaxiCalls]),
    },
    { key: "bleeter", name: t("bleeter"), href: "/bleeter" },
    { key: "truckLogs", name: t("truckLogs"), href: "/truck-logs" },
    { key: "business", name: t("business"), href: "/business" },
  ];

  if (!user) {
    return null;
  }

  return (
    <DropdownMenuButton
      triggerElement={
        <Button
          role="listitem"
          className={classNames(isActive("/citizen") && "font-semibold")}
          variant="transparent"
        >
          {t("citizen")}
          <span className="mt-1 ml-1">
            <ChevronDown width={15} height={15} className="text-gray-700 dark:text-gray-300" />
          </span>
        </Button>
      }
      items={items}
    >
      {(item) => <Item>{item.name}</Item>}
    </DropdownMenuButton>
  );

  return (
    <Dropdown>
      <Dropdown.LinkItem href="/citizen">{t("citizens")}</Dropdown.LinkItem>

      {items.map((item) => {
        const upperCase = item.href.replace(/-/g, "_").replace("/", "").toUpperCase() as Feature;

        if (!enabled[upperCase]) {
          return null;
        }

        return (
          <Dropdown.LinkItem key={item.href} href={item.href}>
            {item.name}
          </Dropdown.LinkItem>
        );
      })}
    </Dropdown>
  );
}
