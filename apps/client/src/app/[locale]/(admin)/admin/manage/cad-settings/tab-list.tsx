"use client";

import { TabList } from "@snailycad/ui";
import { usePathname } from "next/navigation";
import { useTranslations } from "use-intl";

interface CADSettingsTabListProps {
  children: React.ReactNode;
}

export enum SettingsTabs {
  GeneralSettings = "GENERAL_SETTINGS",
  Features = "FEATURES",
  MiscSettings = "MISC_SETTINGS",
  DefaultPermissions = "DEFAULT_PERMISSIONS",
  LiveMap = "LIVE_MAP",
  APIToken = "API_TOKEN",
  DiscordRoles = "DISCORD_ROLES",
  DiscordWebhooks = "DISCORD_WEBHOOKS",
  RawWebhooks = "RAW_WEBHOOKS",
}

export function CADSettingsTabList(props: CADSettingsTabListProps) {
  const pathname = usePathname();
  const t = useTranslations("Management");

  const SETTINGS_TABS = [
    {
      href: "/admin/manage/cad-settings",
      name: t(SettingsTabs.GeneralSettings),
      value: SettingsTabs.GeneralSettings,
    },
    {
      href: "/admin/manage/cad-settings/features",
      name: t(SettingsTabs.Features),
      value: SettingsTabs.Features,
    },
    {
      href: "/admin/manage/cad-settings/advanced",
      name: t(SettingsTabs.MiscSettings),
      value: SettingsTabs.MiscSettings,
    },
    {
      href: "/admin/manage/cad-settings/default-permissions",
      name: t(SettingsTabs.DefaultPermissions),
      value: SettingsTabs.DefaultPermissions,
    },
    {
      href: "/admin/manage/cad-settings/live-map",
      name: t(SettingsTabs.LiveMap),
      value: SettingsTabs.LiveMap,
    },
    {
      href: "/admin/manage/cad-settings/api-token",
      name: t(SettingsTabs.APIToken),
      value: SettingsTabs.APIToken,
    },
    {
      href: "/admin/manage/cad-settings/discord-roles",
      name: t(SettingsTabs.DiscordRoles),
      value: SettingsTabs.DiscordRoles,
    },
    {
      href: "/admin/manage/cad-settings/discord-webhooks",
      name: t(SettingsTabs.DiscordWebhooks),
      value: SettingsTabs.DiscordWebhooks,
    },
    {
      href: "/admin/manage/cad-settings/raw-webhooks",
      name: t(SettingsTabs.RawWebhooks),
      value: SettingsTabs.RawWebhooks,
    },
  ];

  const activeTab = SETTINGS_TABS.findLast((v) => pathname.endsWith(v.href));

  return (
    <TabList activeTab={activeTab?.value} tabs={SETTINGS_TABS}>
      {props.children}
    </TabList>
  );
}
