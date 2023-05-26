import { usePathname } from "next/navigation";
import { ChevronDown } from "react-bootstrap-icons";
import { useFeatureEnabled } from "hooks/use-feature-enabled";
import { useTranslations } from "next-intl";
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
    { key: "citizens", name: t("citizens"), href: "/citizens", show: true },
    {
      key: "taxi",
      name: t("taxi"),
      href: "/taxi",
      show:
        enabled.TAXI && hasPermissions([Permissions.ViewTaxiCalls, Permissions.ManageTaxiCalls]),
    },
    { key: "bleeter", name: t("bleeter"), href: "/bleeter", show: enabled.BLEETER },
    { key: "truckLogs", name: t("truckLogs"), href: "/truck-logs", show: enabled.TRUCK_LOGS },
    { key: "business", name: t("business"), href: "/business", show: enabled.BUSINESS },
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
      items={items.filter((v) => v.show)}
    >
      {(item) => <Item>{item.name}</Item>}
    </DropdownMenuButton>
  );
}
