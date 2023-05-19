import { GetBusinessByIdData } from "@snailycad/types/api";
import { notFound } from "next/navigation";
import { handleServerRequest } from "~/lib/fetch/server";
import { EmployeesTab } from "~/components/business/manage/tabs/employees-tab/employees-tab";

interface ManageBusinessByIdPageProps {
  params: { id: string; employeeId: string };
}

export default async function ManageManageBusinessByIdPage(props: ManageBusinessByIdPageProps) {
  const { data } = await handleServerRequest<GetBusinessByIdData>({
    path: `/businesses/business/${props.params.id}?employeeId=${props.params.employeeId}`,
  });

  const hasManagePermissions = data?.employees.some((v) => {
    const hasManagePermissions =
      v.role?.as === "OWNER" || v.canManageEmployees || v.canManageVehicles;

    return hasManagePermissions && v.citizenId === data.employee?.citizenId;
  });

  if (!data || !hasManagePermissions) {
    return notFound();
  }

  return <EmployeesTab />;
}
