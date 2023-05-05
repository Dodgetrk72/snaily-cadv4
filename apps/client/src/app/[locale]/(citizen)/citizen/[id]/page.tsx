import { notFound } from "next/navigation";
import { CitizenProvider } from "~/context/CitizenContext";
import { handleServerRequest } from "~/lib/fetch/server";
import { InnerUserCitizenPage } from "./component";

interface UserCitizenPageProps {
  params: { id: string };
}

export default async function UserCitizenPage(props: UserCitizenPageProps) {
  const citizen = await handleServerRequest({
    path: `/citizen/${props.params.id}`,
  });

  if (!citizen) {
    notFound();
  }

  return (
    <CitizenProvider initialData={{ citizen: citizen.data }}>
      <InnerUserCitizenPage />
    </CitizenProvider>
  );
}
