import { GetCitizensData } from "@snailycad/types/api";
import { handleServerRequest } from "lib/fetch/server";
import { UserCitizensPageInner } from "./component";

// todo: localized metadata
export const metadata = {
  title: "Citizens",
};

export default async function UserCitizensPage() {
  const citizens = await handleServerRequest<GetCitizensData>({ path: "/citizen" });

  return <UserCitizensPageInner data={citizens.data ?? { citizens: [], totalCount: 0 }} />;
}
