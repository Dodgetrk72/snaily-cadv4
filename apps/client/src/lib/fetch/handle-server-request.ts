"server only";

import type { AxiosResponse } from "axios";
import { headers } from "next/headers";
import { handleRequest } from "./handle-request";

// wrapper function for `handleRequest`. This function will automatically add the `headers` to the request.
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
  return handleRequest({
    path: options.path,
    defaultData: options.defaultData,
    headers: Object.fromEntries(headers().entries()),
  });
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
