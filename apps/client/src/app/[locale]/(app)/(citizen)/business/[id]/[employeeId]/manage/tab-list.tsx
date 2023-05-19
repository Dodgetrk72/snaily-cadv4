"use client";

import * as React from "react";
import { EmployeeAsEnum } from "@snailycad/types";
import { GetBusinessByIdData } from "@snailycad/types/api";
import { BreadcrumbItem, Breadcrumbs, TabList } from "@snailycad/ui";
import { usePathname } from "next/navigation";
import { useTranslations } from "use-intl";
import { Title } from "~/components/shared/Title";
import { useBusinessState } from "~/state/business-state";

interface ManageBusinessByIdTabListProps {
  children: React.ReactNode;
  currentEmployee: NonNullable<GetBusinessByIdData["employee"]>;
  currentBusiness: GetBusinessByIdData;
}

export function ManageBusinessByIdTabList(props: ManageBusinessByIdTabListProps) {
  const pathname = usePathname();
  const t = useTranslations("Business");
  const common = useTranslations("Common");
  const businessActions = useBusinessState((state) => ({
    setCurrentBusiness: state.setCurrentBusiness,
    setCurrentEmployee: state.setCurrentEmployee,
  }));

  const isBusinessOwner = props.currentEmployee.role?.as === EmployeeAsEnum.OWNER;
  const pathPrefix = `/business/${props.currentBusiness.id}/${props.currentEmployee.id}/manage`;

  const TABS_TITLES = [
    {
      isHidden: !props.currentEmployee.canManageEmployees || !isBusinessOwner,
      name: t("allEmployees"),
      value: "allEmployees",
      href: pathPrefix,
    },
    {
      isHidden: !props.currentEmployee.canManageVehicles || !isBusinessOwner,
      name: t("businessVehicles"),
      value: "businessVehicles",
      href: `${pathPrefix}/vehicles`,
    },
    {
      isHidden: !isBusinessOwner,
      name: t("business"),
      value: "business",
      href: `${pathPrefix}/settings`,
    },
    {
      isHidden: !(
        props.currentBusiness.whitelisted &&
        (props.currentEmployee.canManageEmployees || isBusinessOwner)
      ),
      name: t("pendingEmployees"),
      value: "pendingEmployees",
      href: `${pathPrefix}/pending-employees`,
    },
    {
      isHidden: !isBusinessOwner,
      name: t("businessRoles"),
      value: "businessRoles",
      href: `${pathPrefix}/roles`,
    },
  ];

  const activeTab = TABS_TITLES.findLast((v) => pathname.endsWith(v.href));

  React.useEffect(() => {
    businessActions.setCurrentBusiness(props.currentBusiness);
    businessActions.setCurrentEmployee(props.currentEmployee);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <>
      <Title renderLayoutTitle={false} className="!mb-0">
        {common("manage")}
      </Title>

      <Breadcrumbs>
        <BreadcrumbItem href="/business">{t("business")}</BreadcrumbItem>
        <BreadcrumbItem href={`/business/${props.currentBusiness.id}/${props.currentEmployee.id}`}>
          {props.currentBusiness.name}
        </BreadcrumbItem>
        <BreadcrumbItem>{common("manage")}</BreadcrumbItem>
      </Breadcrumbs>

      <TabList activeTab={activeTab?.value} tabs={TABS_TITLES}>
        {props.children}
      </TabList>
    </>
  );
}
