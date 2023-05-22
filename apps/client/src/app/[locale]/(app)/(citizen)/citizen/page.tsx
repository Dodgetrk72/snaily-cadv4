import { GetCitizensData } from "@snailycad/types/api";
import { handleServerRequest } from "~/lib/fetch/handle-server-request";
import { UserCitizensPageInner } from "./component";

// todo: localized metadata
export const metadata = {
  title: "Citizens",
};

export default async function UserCitizensPage() {
  const citizens = await handleServerRequest<GetCitizensData>({
    path: "/citizen",
    defaultData: { citizens: [], totalCount: 0 },
  });

  console.log({ citizens });

  return <UserCitizensPageInner data={citizens.data} />;
}
