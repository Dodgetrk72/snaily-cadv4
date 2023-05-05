"server only";

import { getAPIUrl } from "@snailycad/utils/api-url";
import axios, { AxiosResponse } from "axios";
import { headers } from "next/headers";
import { getErrorObj } from "./errors";

interface HandleServerRequestOptions {
  path: string;
}

export async function handleServerRequest<T = any>(
  options: HandleServerRequestOptions,
): Promise<AxiosResponse<T, T>> {
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

    return makeReturn(response);
  } catch (e) {
    return makeReturn(e);
  }
}

function makeReturn<T>(v: any): Omit<AxiosResponse<T>, "request"> {
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
