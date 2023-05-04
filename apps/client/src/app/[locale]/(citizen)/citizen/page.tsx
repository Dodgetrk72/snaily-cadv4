import { requestAll } from "lib/utils";
import { headers } from "next/headers";

export default async function UserCitizensPage() {
  const [data] = await requestAll({ headers: Object.fromEntries(headers().entries()) }, [
    ["/citizen", { citizens: [], totalCount: 0 }],
  ]);

  console.log({ data });

  return <div>hello world</div>;
}
