import { GetBusinessByIdData } from "@snailycad/types/api";
import { notFound } from "next/navigation";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerBusinessByIdPage } from "./component";

interface BusinessByIdPageProps {
  params: { id: string; employeeId: string };
}

export default async function BusinessByIdPage(props: BusinessByIdPageProps) {
  const { data } = await handleServerRequest<GetBusinessByIdData>({
    path: `/businesses/business/${props.params.id}?employeeId=${props.params.employeeId}`,
  });

  if (!data?.employee) {
    return notFound();
  }

  return <InnerBusinessByIdPage business={data} />;
}
