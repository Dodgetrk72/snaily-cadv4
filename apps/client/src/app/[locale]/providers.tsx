"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "~/context/auth-context";
import { NextIntlClientProvider } from "next-intl";
import { ErrorBoundary } from "@sentry/nextjs";
import { ValuesProvider } from "~/context/values-context";
import { SSRProvider } from "@react-aria/ssr";

import { Toaster } from "react-hot-toast";
import { SocketProvider } from "@casper124578/use-socket.io";
import { ErrorFallback } from "~/components/error-fallback";
import { getAPIUrl } from "@snailycad/utils/api-url";
import { GetCADSettingsData, GetUserData } from "@snailycad/types/api";
import type { GetErrorMapOptions } from "lib/validation/zod-error-map";
import type { SetSentryTagsOptions } from "lib/set-sentry-tags";

interface ProvidersProps {
  messages: Record<string, string>;
  children: React.ReactNode;
  user: GetUserData | null;
  cad: GetCADSettingsData | null;
}

export function Providers(props: ProvidersProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  const { protocol, host } = new URL(getAPIUrl());
  const url = `${protocol}//${host}`;
  const locale = props.user?.locale ?? "en";

  React.useEffect(() => {
    // set error map for localized form error messages
    setErrorMap({ messages: props.messages, locale });

    // set extra sentry tags
    _setSentryTags({ cad: props.cad, locale });
  }, [locale, props.cad, props.messages]);

  return (
    <SSRProvider>
      <ValuesProvider initialData={{ values: [] }}>
        <ErrorBoundary fallback={ErrorFallback}>
          <QueryClientProvider client={queryClient}>
            <SocketProvider uri={url}>
              <NextIntlClientProvider
                now={new Date()}
                onError={console.warn}
                messages={props.messages}
                locale={locale}
                defaultTranslationValues={{
                  span: (children) => <span className="font-semibold">{children}</span>,
                }}
              >
                <Toaster position="top-right" />

                <AuthProvider initialData={{ cad: props.cad, session: props.user }}>
                  {props.children}
                </AuthProvider>
              </NextIntlClientProvider>
            </SocketProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </ValuesProvider>
    </SSRProvider>
  );
}

async function setErrorMap(options: GetErrorMapOptions) {
  const getErrorMap = await import("lib/validation/zod-error-map").then((mod) => mod.getErrorMap);
  const setZodErrorMap = await import("zod").then((mod) => mod.setErrorMap);

  setZodErrorMap(getErrorMap(options));
}

async function _setSentryTags(options: SetSentryTagsOptions) {
  (await import("lib/set-sentry-tags")).setSentryTags(options);
}
