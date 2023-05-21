import { GetUserData } from "@snailycad/types/api";
import { handleRequest } from "../fetch/handle-request";
import { WhitelistStatus } from "@snailycad/types";

export async function getAuthenticatedUserServer() {
  try {
    const response = await handleRequest<GetUserData | null>({
      defaultData: null,
      path: "/user",
    });

    // @ts-expect-error `response` only exists on the object if an error occurred.
    if (response.response?.data?.message === "whitelistPending") {
      return { whitelistStatus: WhitelistStatus.PENDING } as GetUserData;
    }

    return null;
  } catch (e) {
    return null;
  }
}
