"server only";

import { getAPIUrl } from "@snailycad/utils/api-url";
import axios, { AxiosResponse } from "axios";
import { headers } from "next/headers";
import { getErrorObj } from "./errors";

interface HandleServerRequestOptions<T> {
  path: string;
  defaultData?: T;
}

export async function handleServerRequest<T = any>(
  options: HandleServerRequestOptions<T>,
): Promise<AxiosResponse<T | undefined>> {
  const apiUrl = getAPIUrl();
  const isDispatchUrl = ["/dispatch", "/dispatch/map"].includes(String());

  const cookieHeader = headers().get("cookie");

  try {
    const response = await axios({
      url: `${apiUrl}${options.path}`,
      withCredentials: true,
      headers: {
        Session: cookieHeader,
        "Content-Type": "application/json",
        "is-from-dispatch": String(isDispatchUrl),
      },
    });

    const responseObj = makeReturn<T>(response);

    if (!responseObj.data && options.defaultData) {
      responseObj.data = options.defaultData;
    }

    return responseObj;
  } catch (e) {
    return makeReturn<T>(e);
  }
}

function makeReturn<T>(v: any): Omit<AxiosResponse<T, T>, "request"> {
  const errorObj = getErrorObj(v);

  return {
    data: v.data,
    status: v.status,
    statusText: v.statusText,
    headers: v.headers,
    config: v.config,
    ...errorObj,
  };
}
