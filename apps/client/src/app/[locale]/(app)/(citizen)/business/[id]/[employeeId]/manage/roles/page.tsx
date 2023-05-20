"use client";

import { EmployeeAsEnum } from "@snailycad/types";
import { ExclamationCircleFill } from "react-bootstrap-icons";
import { useTranslations } from "use-intl";
import { shallow } from "zustand/shallow";
import { BusinessRolesTab } from "~/components/business/manage/tabs/roles-tab/business-roles-tab";
import { Link } from "~/components/shared/link";
import { useBusinessState } from "~/state/business-state";

export default function BusinessRolesPageTab() {
  const { currentEmployee, currentBusiness } = useBusinessState(
    (state) => ({
      currentEmployee: state.currentEmployee,
      currentBusiness: state.currentBusiness,
    }),
    shallow,
  );

  const isBusinessOwner = currentEmployee?.role?.as === EmployeeAsEnum.OWNER;
  const t = useTranslations("Business");

  if (!currentBusiness || !currentEmployee) {
    // loading
    return null;
  }

  if (!isBusinessOwner) {
    return (
      <div
        role="alert"
        className="mb-5 flex flex-col p-2 px-4 text-black rounded-md shadow bg-red-400 border border-red-500/80"
      >
        <header className="flex items-center gap-2 mb-2">
          <ExclamationCircleFill />
          <h5 className="font-semibold text-lg">{t("insufficientPermissions")}</h5>
        </header>
        <p>
          {t("mustBeBusinessOwner")}{" "}
          <Link
            href={`/business/${currentBusiness?.id}/${currentEmployee?.id}`}
            className="font-medium underline"
          >
            Go back
          </Link>
        </p>
      </div>
    );
  }

  return <BusinessRolesTab />;
}
