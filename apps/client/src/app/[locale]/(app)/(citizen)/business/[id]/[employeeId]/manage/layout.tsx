import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { ManageBusinessByIdTabList } from "./tab-list";
import { GetBusinessByIdData } from "@snailycad/types/api";
import { notFound } from "next/navigation";

interface ManageBusinessByIdLayoutProps {
  params: { id: string; employeeId: string };
  children: React.ReactNode;
}

export default async function ManageBusinessByIdLayout(props: ManageBusinessByIdLayoutProps) {
  const { data } = await handleServerRequest<GetBusinessByIdData>({
    path: `/businesses/business/${props.params.id}?employeeId=${props.params.employeeId}`,
  });

  const currentEmployee = data?.employee;

  const hasManagePermissions = data?.employees.some((v) => {
    const hasManagePermissions =
      v.role?.as === "OWNER" || v.canManageEmployees || v.canManageVehicles;

    return hasManagePermissions && v.citizenId === data.employee?.citizenId;
  });

  if (!data || !currentEmployee || !hasManagePermissions) {
    return notFound();
  }

  return (
    <ManageBusinessByIdTabList currentBusiness={data} currentEmployee={currentEmployee}>
      {props.children}
    </ManageBusinessByIdTabList>
  );
}
