import { getAPIUrl } from "@snailycad/utils/api-url";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getErrorObj } from "./errors";

interface BaseOptions extends AxiosRequestConfig {
  data?: unknown;
}

export function handleRequest<T = any>(
  options: BaseOptions & {
    path: string;
    defaultData: T;
  },
): Promise<AxiosResponse<T>>;
export function handleRequest<T = any>(
  options: BaseOptions & {
    path: string;
    defaultData?: undefined;
  },
): Promise<AxiosResponse<T | undefined>>;
export async function handleRequest<T = any>(
  options: BaseOptions & {
    path: string;
    defaultData?: T | undefined;
  },
): Promise<AxiosResponse<T | undefined>> {
  const apiUrl = getAPIUrl();
  // todo:
  const isDispatchUrl = ["/dispatch", "/dispatch/map"].includes(String());
  const cookieHeader = options.headers?.cookie;

  try {
    const response = await axios({
      method: options.method,
      data: options.data,
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
