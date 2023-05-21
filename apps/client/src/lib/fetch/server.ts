"server only";

import { getAPIUrl } from "@snailycad/utils/api-url";
import axios, { AxiosResponse } from "axios";
import { headers } from "next/headers";
import { getErrorObj } from "./errors";

export function handleServerRequest<T = any>(options: {
  path: string;
  defaultData: T;
}): Promise<AxiosResponse<T>>;
export function handleServerRequest<T = any>(options: {
  path: string;
  defaultData?: undefined;
}): Promise<AxiosResponse<T | undefined>>;
export async function handleServerRequest<T = any>(options: {
  path: string;
  defaultData?: T | undefined;
}): Promise<AxiosResponse<T | undefined>> {
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

type Config<T extends [...any[]]> = {
  [Index in keyof T]: { path: string; defaultData?: T[Index] };
} & { length: T["length"] };

type Response<T extends [...any[]]> = {
  [Index in keyof T]: T[Index];
};

export async function handleMultiServerRequest<T extends any[]>(
  config: Config<T>,
): Promise<Response<T>> {
  return Promise.all(
    config.map(async ({ path, defaultData = {} }) => {
      return handleServerRequest<T>({
        path,
      })
        .then((v) => (typeof v.data === "undefined" ? defaultData : v.data))
        .catch(() => defaultData);
    }),
  ) as Response<T>;
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
