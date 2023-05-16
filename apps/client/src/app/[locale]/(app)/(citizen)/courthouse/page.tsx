import { handleMultiServerRequest } from "~/lib/fetch/server";
import { InnerCitizenCourthousePage } from "./component";

async function getCitizenCourthouseData() {
  const [expungementRequests, nameChangeRequests] = await handleMultiServerRequest([
    { path: "/expungement-requests", defaultData: [] },
    { path: "/name-change", defaultData: [] },
  ]);

  return {
    expungementRequests,
    nameChangeRequests,
  };
}

export default async function CitizenCourthousePage() {
  const data = await getCitizenCourthouseData();
  return <InnerCitizenCourthousePage {...data} />;
}
