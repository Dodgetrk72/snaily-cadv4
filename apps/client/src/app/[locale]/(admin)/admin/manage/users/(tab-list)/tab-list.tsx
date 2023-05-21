"use client";

import { Button, TabList } from "@snailycad/ui";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useTranslations } from "use-intl";
import { AdminNotificationKeys } from "~/components/admin/sidebar/sidebar";
import { Title } from "~/components/shared/Title";
import { Permissions, usePermission } from "~/hooks/usePermission";
import { useModal } from "~/state/modalState";
import { ModalIds } from "~/types/ModalIds";

interface ManageUsersTabListProps {
  children: React.ReactNode;
  notifications?: Record<AdminNotificationKeys, number>;
}

export function ManageUsersTabList(props: ManageUsersTabListProps) {
  const pathname = usePathname();
  const t = useTranslations("Management");
  const { openModal } = useModal();

  const { data } = useQuery({
    initialData: props.notifications,
    queryKey: ["admin", "notifications"],
  });

  const { hasPermissions } = usePermission();
  const hasManagePermissions = hasPermissions([
    Permissions.ManageUsers,
    Permissions.BanUsers,
    Permissions.DeleteUsers,
  ]);

  const pendingUsersCount = data?.pendingUsers ?? 0;
  const TABS = [
    { href: "/admin/manage/users", name: t("allUsers"), value: "allUsers" },
    {
      href: "/admin/manage/users/pending",
      name: `${t("pendingUsers")} (${pendingUsersCount})`,
      value: "pendingUsers",
    },
  ];

  const activeTab = TABS.findLast((v) => pathname.endsWith(v.href));

  return (
    <>
      <header className="flex items-center justify-between">
        <Title>{t("MANAGE_USERS")}</Title>

        {hasManagePermissions ? (
          <div>
            <Button onClick={() => openModal(ModalIds.PruneUsers)}>Prune Users</Button>
          </div>
        ) : null}
      </header>

      <TabList activeTab={activeTab?.value} tabs={TABS}>
        {props.children}
      </TabList>
    </>
  );
}
