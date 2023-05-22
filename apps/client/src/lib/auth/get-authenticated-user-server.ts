import { GetUserData } from "@snailycad/types/api";
import { handleServerRequest } from "../fetch/handle-server-request";
import { WhitelistStatus } from "@snailycad/types";

export async function getAuthenticatedUserServer() {
  try {
    const response = await handleServerRequest<GetUserData | null>({
      path: "/user",
      defaultData: null,
    });

    if (response.data) {
      return response.data;
    }

    // @ts-expect-error `response` only exists on the object if an error occurred.
    if (response.response?.data?.message === "whitelistPending") {
      return { whitelistStatus: WhitelistStatus.PENDING } as GetUserData;
    }

    return null;
  } catch (e) {
    return null;
  }
}
