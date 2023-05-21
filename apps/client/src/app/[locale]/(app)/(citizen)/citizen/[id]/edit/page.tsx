import { notFound } from "next/navigation";
import { CitizenProvider } from "~/context/citizen-context";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { InnerEditUserCitizenPage } from "./component";
import { GetCitizenByIdData } from "@snailycad/types/api";

interface EditUserCitizenPage {
  params: { id: string };
}

export default async function EditUserCitizenPage(props: EditUserCitizenPage) {
  const citizen = await handleServerRequest<GetCitizenByIdData>({
    path: `/citizen/${props.params.id}`,
  });

  if (!citizen.data) {
    notFound();
  }

  return (
    <CitizenProvider initialData={{ citizen: citizen.data }}>
      <InnerEditUserCitizenPage />
    </CitizenProvider>
  );
}
