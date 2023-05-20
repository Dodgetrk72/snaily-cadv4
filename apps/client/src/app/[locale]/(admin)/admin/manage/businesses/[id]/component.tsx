"use client";

import { EmployeeAsEnum, ValueType, WhitelistStatus } from "@snailycad/types";
import {
  DeleteBusinessFireEmployeeData,
  GetManageBusinessByIdEmployeesData,
} from "@snailycad/types/api";
import { Button } from "@snailycad/ui";
import dynamic from "next/dynamic";
import { ExclamationCircleFill } from "react-bootstrap-icons";
import { useTranslations } from "use-intl";
import { Status } from "~/components/shared/Status";
import { Table, useAsyncTable, useTableState } from "~/components/shared/Table";
import { Title } from "~/components/shared/Title";
import { Link } from "~/components/shared/link";
import { useTemporaryItem } from "~/hooks/shared/useTemporaryItem";
import { useLoadValuesClientSide } from "~/hooks/useLoadValuesClientSide";
import { Permissions, usePermission } from "~/hooks/usePermission";
import useFetch from "~/lib/useFetch";
import { yesOrNoText } from "~/lib/utils";
import { useModal } from "~/state/modalState";
import { ModalIds } from "~/types/ModalIds";

interface InnerManageBusinessByIdPageProps {
  params: { id: string };
  business: GetManageBusinessByIdEmployeesData;
}

const AlertModal = dynamic(async () => (await import("components/modal/AlertModal")).AlertModal, {
  ssr: false,
});

const ManageEmployeeModal = dynamic(
  async () =>
    (await import("components/business/manage/tabs/employees-tab/manage-employee-modal"))
      .ManageEmployeeModal,
  { ssr: false },
);

export function InnerManageBusinessByIdPage(props: InnerManageBusinessByIdPageProps) {
  const { state, execute } = useFetch();
  const { openModal, closeModal } = useModal();
  const { hasPermissions } = usePermission();
  const hasManagePermissions = hasPermissions([
    Permissions.ManageBusinesses,
    Permissions.DeleteBusinesses,
  ]);

  useLoadValuesClientSide({
    valueTypes: [ValueType.BUSINESS_ROLE],
  });

  const tableState = useTableState();
  const asyncTable = useAsyncTable({
    fetchOptions: {
      path: `/admin/manage/businesses/${props.params.id}/employees`,
      onResponse: (data: GetManageBusinessByIdEmployeesData) => ({
        data: data.employees,
        totalCount: data.totalCount,
      }),
    },
    totalCount: props.business.totalCount,
    initialData: props.business.employees,
  });

  const [tempEmployee, employeeState] = useTemporaryItem(asyncTable.items);
  const t = useTranslations();
  const common = useTranslations("Common");
  const isBusinessPendingApproval = props.business.status === WhitelistStatus.PENDING;

  async function handleFireEmployee() {
    if (!hasManagePermissions || !tempEmployee) return;

    const { json } = await execute<DeleteBusinessFireEmployeeData>({
      path: `/admin/manage/businesses/employees/${tempEmployee.id}`,
      data: { employeeId: tempEmployee.id },
      method: "DELETE",
    });

    if (json) {
      asyncTable.remove(tempEmployee.id);
      employeeState.setTempId(null);
      closeModal(ModalIds.AlertFireEmployee);
    }
  }

  return (
    <>
      <Title className="mb-5">{t("Business.employees")}</Title>

      {isBusinessPendingApproval ? (
        <div
          role="alert"
          className="mb-5 flex flex-col p-2 px-4 text-black rounded-md shadow bg-orange-400 border border-orange-500/80"
        >
          <header className="flex items-center gap-2 mb-2">
            <ExclamationCircleFill />
            <h5 className="font-semibold text-lg">Business is pending approval</h5>
          </header>
          <p>
            This business is still pending approval. It must first be approved by an administrator
            before any changes can be done.{" "}
            <Link className="font-medium underline" href="/admin/manage/businesses">
              Go back
            </Link>
          </p>
        </div>
      ) : null}

      <Table
        tableState={tableState}
        data={asyncTable.items.map((employee) => ({
          id: employee.id,
          name: `${employee.citizen.name} ${employee.citizen.surname}`,
          role: employee.role?.value.value ?? common("none"),
          canCreatePosts: common(yesOrNoText(employee.canCreatePosts)),
          employeeOfTheMonth: common(yesOrNoText(employee.employeeOfTheMonth)),
          whitelistStatus: <Status>{employee.whitelistStatus}</Status>,
          actions: (
            <>
              <Button
                onPress={() => {
                  employeeState.setTempId(employee.id);
                  openModal(ModalIds.ManageEmployee);
                }}
                size="xs"
                variant="success"
                disabled={isBusinessPendingApproval}
              >
                {common("manage")}
              </Button>
              <Button
                onPress={() => {
                  employeeState.setTempId(employee.id);
                  openModal(ModalIds.AlertFireEmployee);
                }}
                size="xs"
                isDisabled={isBusinessPendingApproval || employee.role?.as === EmployeeAsEnum.OWNER}
                disabled={isBusinessPendingApproval || employee.role?.as === EmployeeAsEnum.OWNER}
                className="ml-2"
                variant="danger"
              >
                {t("Business.fire")}
              </Button>
            </>
          ),
        }))}
        columns={[
          { header: common("name"), accessorKey: "name" },
          { header: t("Business.role"), accessorKey: "role" },
          { header: t("Business.canCreatePosts"), accessorKey: "canCreatePosts" },
          { header: t("Business.employeeOfTheMonth"), accessorKey: "employeeOfTheMonth" },
          { header: t("Business.whitelistStatus"), accessorKey: "whitelistStatus" },
          { header: common("actions"), accessorKey: "actions" },
        ]}
      />

      {hasManagePermissions && !isBusinessPendingApproval ? (
        <>
          <AlertModal
            onDeleteClick={handleFireEmployee}
            id={ModalIds.AlertFireEmployee}
            title={t("Business.fireEmployee")}
            description={t.rich("Business.alert_fireEmployee", {
              span: (children) => <span className="font-semibold">{children}</span>,
              employee:
                tempEmployee && `${tempEmployee.citizen.name} ${tempEmployee.citizen.surname}`,
            })}
            deleteText={t("Business.fire")}
            state={state}
            onClose={() => employeeState.setTempId(null)}
          />

          <ManageEmployeeModal
            isAdmin
            onUpdate={(_oldEmployee, employee) => asyncTable.update(employee.id, employee)}
            employee={tempEmployee}
          />
        </>
      ) : null}
    </>
  );
}
