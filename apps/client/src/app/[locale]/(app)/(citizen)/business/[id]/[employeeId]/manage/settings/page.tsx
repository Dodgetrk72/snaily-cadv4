"use client";

import { EmployeeAsEnum } from "@snailycad/types";
import { Loader } from "@snailycad/ui";
import { ExclamationCircleFill } from "react-bootstrap-icons";
import { useTranslations } from "use-intl";
import { shallow } from "zustand/shallow";
import { ManageBusinessTab } from "~/components/business/manage/tabs/business-tab";
import { Link } from "~/components/shared/link";
import { useBusinessState } from "~/state/business-state";

export default function BusinessSettingsPageTab() {
  const { currentEmployee, currentBusiness } = useBusinessState(
    (state) => ({
      currentEmployee: state.currentEmployee,
      currentBusiness: state.currentBusiness,
    }),
    shallow,
  );

  const isBusinessOwner = currentEmployee?.role?.as === EmployeeAsEnum.OWNER;
  const t = useTranslations("Business");

  // the state is being set in a `React.useEffect`. Show loading state until the state is set
  if (!currentEmployee || !currentBusiness) {
    return (
      <div className="p-32 grid place-content-center w-full h-full">
        <Loader />
      </div>
    );
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

  return <ManageBusinessTab />;
}
